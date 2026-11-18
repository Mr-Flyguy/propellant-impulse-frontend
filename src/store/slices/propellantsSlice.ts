import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { propellantApi } from '../../api/apiClient';
import type {
  PropellantResponseDto,
  PublishPropellantDto,
} from '../../api/generated/PropellantApi';
import { INITIAL_MOCK_PROPELLANTS } from '../../data/mockPropellants';

// Convert mock data to unified PropellantResponseDto schema
export const MOCK_DTO_ITEMS: PropellantResponseDto[] = INITIAL_MOCK_PROPELLANTS.map((m) => ({
  id: m.id,
  name: m.name,
  description: m.description,
  short_description: m.description.slice(0, 120),
  status: 'published' as const,
  image_url: m.imageUrl || '/img/default_propellant.jpg',
  video_url: m.videoUrl || null,
  molar_mass: m.molarMass,
  specific_heat_ratio: m.specificHeatRatio,
  creator_id: 1,
  likes_count: m.likesCount,
  is_creator: 0,
  is_liked: 0,
  created_at: m.createdAt,
  updated_at: m.createdAt,
}));

export interface PropellantsState {
  catalog: PropellantResponseDto[];
  feedItem: PropellantResponseDto | null;
  draftItem: PropellantResponseDto | null;
  feedIndex: number;
  loading: boolean;
  error: string | null;
  isMockMode: boolean;
}

const initialState: PropellantsState = {
  catalog: MOCK_DTO_ITEMS,
  feedItem: MOCK_DTO_ITEMS[0] || null,
  draftItem: null,
  feedIndex: 0,
  loading: false,
  error: null,
  isMockMode: false,
};

// 1. Thunk: Fetch catalog of propellants using generated Swagger client + Axios
export const fetchPropellantsThunk = createAsyncThunk<
  { data: PropellantResponseDto[]; isMock: boolean },
  { max_molar_mass?: number; query?: string } | undefined
>('propellants/fetchPropellantsThunk', async (params) => {
  try {
    const maxMassStr = params?.max_molar_mass !== undefined ? String(params.max_molar_mass) : undefined;
    const res = await propellantApi.api.propellantsApiControllerGetCatalog({
      max_molar_mass: maxMassStr,
      query: params?.query,
    });
    return { data: res.data, isMock: false };
  } catch (err: any) {
    // Fallback to mock objects when backend is unavailable (guest mode)
    console.warn('Backend unavailable, falling back to mock propellants collection:', err.message);
    let filtered = [...MOCK_DTO_ITEMS];
    if (params?.max_molar_mass !== undefined) {
      filtered = filtered.filter((p) => (p.molar_mass ?? 0) <= params.max_molar_mass!);
    }
    if (params?.query) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(params.query!.toLowerCase())
      );
    }
    return { data: filtered, isMock: true };
  }
});

// 2. Thunk: Fetch feed card using generated Swagger client + Axios
export const fetchPropellantFeedThunk = createAsyncThunk<
  { data: PropellantResponseDto; nextIndex?: number },
  { id?: number; next?: boolean } | undefined
>('propellants/fetchPropellantFeedThunk', async (params, { getState }) => {
  try {
    const res = await propellantApi.api.propellantsApiControllerGetFeed({
      id: params?.id ? String(params.id) : undefined,
      next: params?.next ? 'true' : 'false',
    });
    return { data: res.data };
  } catch (err) {
    // Fallback in mock mode: navigate locally through mock collection
    const state = getState() as { propellants: PropellantsState };
    const items = state.propellants.catalog.length > 0 ? state.propellants.catalog : MOCK_DTO_ITEMS;
    let nextIdx = 0;
    if (params?.id) {
      const cur = items.findIndex((i) => i.id === params.id);
      nextIdx = cur !== -1 ? (params?.next ? (cur + 1) % items.length : cur) : 0;
    } else {
      nextIdx = (state.propellants.feedIndex + 1) % items.length;
    }
    return { data: items[nextIdx], nextIndex: nextIdx };
  }
});

// 3. Thunk: Fetch user draft using generated Swagger client + Axios
export const fetchPropellantDraftThunk = createAsyncThunk<
  PropellantResponseDto | null
>('propellants/fetchPropellantDraftThunk', async (_, { rejectWithValue }) => {
  try {
    const res = await propellantApi.api.propellantsApiControllerGetDraft();
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      return null;
    }
    return rejectWithValue(err.message);
  }
});

// 4. Thunk: Create or save draft (Step 1 of creator wizard) using Axios multipart form-data
export const createPropellantDraftThunk = createAsyncThunk<
  PropellantResponseDto,
  { name: string; imageFile?: File | null; videoFile?: File | null }
>('propellants/createPropellantDraftThunk', async (payload, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('name', payload.name);
    if (payload.imageFile) {
      formData.append('image', payload.imageFile);
    }
    if (payload.videoFile) {
      formData.append('video', payload.videoFile);
    }
    const response = await axios.post<PropellantResponseDto>(
      '/api/propellants',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 5. Thunk: Publish propellant draft (Step 2 of creator wizard)
export const publishPropellantThunk = createAsyncThunk<
  PropellantResponseDto,
  { id: number; data?: PublishPropellantDto }
>('propellants/publishPropellantThunk', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await propellantApi.api.propellantsApiControllerPublish(id, data || {});
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 6. Thunk: Soft delete propellant
export const deletePropellantThunk = createAsyncThunk<
  number,
  number
>('propellants/deletePropellantThunk', async (id, { rejectWithValue }) => {
  try {
    await propellantApi.api.propellantsApiControllerDelete(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 7. Thunk: Toggle like for propellant
export const toggleLikePropellantThunk = createAsyncThunk<
  { id: number; like: boolean; likesCount: number },
  { id: number; like: boolean }
>('propellants/toggleLikePropellantThunk', async ({ id, like }, { rejectWithValue, getState }) => {
  try {
    await propellantApi.api.propellantsApiControllerToggleLike(id, { like });
    const state = getState() as { propellants: PropellantsState };
    const cur = state.propellants.catalog.find((p) => p.id === id);
    const prevCount = cur ? cur.likes_count : 0;
    const newCount = like ? prevCount + 1 : Math.max(0, prevCount - 1);
    return { id, like, likesCount: newCount };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const propellantsSlice = createSlice({
  name: 'propellants',
  initialState,
  reducers: {
    setFeedIndex(state, action: PayloadAction<number>) {
      state.feedIndex = action.payload;
      if (state.catalog[action.payload]) {
        state.feedItem = state.catalog[action.payload];
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchPropellantsThunk
    builder
      .addCase(fetchPropellantsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropellantsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.catalog = action.payload.data;
        state.isMockMode = action.payload.isMock;
        if (!state.feedItem && action.payload.data.length > 0) {
          state.feedItem = action.payload.data[0];
          state.feedIndex = 0;
        }
      })
      .addCase(fetchPropellantsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Ошибка загрузки каталога рабочих тел';
      });

    // fetchPropellantFeedThunk
    builder
      .addCase(fetchPropellantFeedThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropellantFeedThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.feedItem = action.payload.data;
        if (action.payload.nextIndex !== undefined) {
          state.feedIndex = action.payload.nextIndex;
        } else {
          const idx = state.catalog.findIndex((p) => p.id === action.payload.data.id);
          if (idx !== -1) state.feedIndex = idx;
        }
      })
      .addCase(fetchPropellantFeedThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Ошибка загрузки ленты';
      });

    // fetchPropellantDraftThunk
    builder
      .addCase(fetchPropellantDraftThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropellantDraftThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.draftItem = action.payload;
      })
      .addCase(fetchPropellantDraftThunk.rejected, (state) => {
        state.loading = false;
        state.draftItem = null;
      });

    // createPropellantDraftThunk
    builder
      .addCase(createPropellantDraftThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPropellantDraftThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.draftItem = action.payload;
      })
      .addCase(createPropellantDraftThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Ошибка создания черновика';
      });

    // publishPropellantThunk
    builder
      .addCase(publishPropellantThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishPropellantThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.draftItem = null;
        // Prepend published item to catalog
        state.catalog = [action.payload, ...state.catalog.filter((p) => p.id !== action.payload.id)];
      })
      .addCase(publishPropellantThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Ошибка публикации черновика';
      });

    // deletePropellantThunk
    builder
      .addCase(deletePropellantThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePropellantThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.catalog = state.catalog.filter((p) => p.id !== action.payload);
        if (state.feedItem?.id === action.payload) {
          state.feedItem = state.catalog[0] || null;
        }
      })
      .addCase(deletePropellantThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Ошибка удаления рабочего тела';
      });

    // toggleLikePropellantThunk
    builder
      .addCase(toggleLikePropellantThunk.fulfilled, (state, action) => {
        const { id, like, likesCount } = action.payload;
        if (state.feedItem && state.feedItem.id === id) {
          state.feedItem.is_liked = like ? 1 : 0;
          state.feedItem.likes_count = likesCount;
        }
        const item = state.catalog.find((p) => p.id === id);
        if (item) {
          item.is_liked = like ? 1 : 0;
          item.likes_count = likesCount;
        }
      });
  },
});

export const { setFeedIndex, clearError } = propellantsSlice.actions;

export default propellantsSlice.reducer;
