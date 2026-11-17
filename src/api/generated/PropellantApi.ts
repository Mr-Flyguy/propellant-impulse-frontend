/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface PropellantResponseDto {
  /**
   * Уникальный идентификатор
   * @example 1
   */
  id: number;
  /**
   * Наименование
   * @example "Жидкий водород"
   */
  name: string;
  /**
   * Описание рабочего тела
   * @example "Эффективное рабочее тело с минимальной массой"
   */
  description: string | null;
  /**
   * Краткое описание (алиас)
   * @example "Эффективное рабочее тело с минимальной массой"
   */
  short_description: string | null;
  /**
   * Статус публикации
   * @example "published"
   */
  status: "draft" | "published" | "deleted";
  /**
   * URL изображения
   * @example "http://localhost:9000/propellants/propellant_h2.jpg"
   */
  image_url: string | null;
  /**
   * URL видео выхлопа
   * @example "http://localhost:9000/propellants/video_exhaust_h2.mp4"
   */
  video_url: string | null;
  /**
   * Молярная масса продуктов сгорания (г/моль)
   * @example 2.016
   */
  molar_mass: number | null;
  /**
   * Показатель адиабаты
   * @example 1.41
   */
  specific_heat_ratio: number | null;
  /**
   * ID пользователя-создателя (автозаполняется из сессии)
   * @example 1
   */
  creator_id: number;
  /**
   * Количество отметок "нравится"
   * @example 4
   */
  likes_count: number;
  /**
   * 1 если текущий пользователь является создателем, иначе 0
   * @example 1
   */
  is_creator: number;
  /**
   * 1 если текущий пользователь поставил отметку "нравится", иначе 0
   * @example 0
   */
  is_liked: number;
  /**
   * Дата создания
   * @example "2026-10-20T21:17:16.614Z"
   */
  created_at: string | null;
  /**
   * Дата обновления (null для неопубликованного черновика)
   * @example "2026-10-20T21:17:16.614Z"
   */
  updated_at: string | null;
}

export interface CreatePropellantDto {
  /**
   * Наименование рабочего тела
   * @example "Метан жидкий"
   */
  name: string;
  /**
   * Описание рабочего тела
   * @example "Перспективное экологичное ракетное топливо с высокой плотностью"
   */
  description?: string;
  /**
   * Краткое описание (алиас для обратной совместимости)
   * @example "Перспективное экологичное ракетное топливо"
   */
  short_description?: string;
  /**
   * Молярная масса продуктов сгорания (г/моль)
   * @example 16.04
   */
  molar_mass?: object;
  /**
   * Показатель адиабаты (отношение теплоемкостей)
   * @example 1.32
   */
  specific_heat_ratio?: object;
}

export interface UpdatePropellantDto {
  /**
   * Наименование рабочего тела
   * @example "Жидкий метан модифицированный"
   */
  name?: string;
  /**
   * Описание рабочего тела
   * @example "Модифицированное описание рабочего тела"
   */
  description?: string;
  /**
   * Краткое описание (алиас для обратной совместимости)
   * @example "Модифицированное описание рабочего тела"
   */
  short_description?: string;
  /**
   * Молярная масса продуктов истечения (г/моль)
   * @example 16.5
   */
  molar_mass?: object;
  /**
   * Показатель адиабаты (отношение теплоемкостей)
   * @example 1.3
   */
  specific_heat_ratio?: object;
  /**
   * Статус публикации
   * @example "published"
   */
  status?: "draft" | "published" | "deleted";
}

export interface PublishPropellantDto {
  /**
   * Наименование рабочего тела
   * @example "Метан жидкий"
   */
  name?: string;
  /**
   * Описание рабочего тела
   * @example "Экологичное рабочее тело для двигательной установки"
   */
  description?: string;
  /**
   * Краткое описание (алиас для обратной совместимости)
   * @example "Экологичное рабочее тело для двигательной установки"
   */
  short_description?: string;
  /**
   * Молярная масса продуктов сгорания (г/моль)
   * @example 16.04
   */
  molar_mass?: number | null;
  /**
   * Показатель адиабаты (отношение теплоемкостей)
   * @example 1.32
   */
  specific_heat_ratio?: number | null;
}

export interface LikePropellantDto {
  /**
   * Отметка "нравится" (1 или true - поставить, 0 или false - снять)
   * @example 1
   */
  like: boolean | number;
}

export interface RegisterUserDto {
  /**
   * Уникальный логин инженера
   * @example "test_engineer"
   */
  username: string;
  /**
   * Электронная почта
   * @example "engineer@bmstu.ru"
   */
  email: string;
  /**
   * Пароль (минимум 4 символа)
   * @example "secret123"
   */
  password: string;
}

export interface LoginUserDto {
  /**
   * Логин инженера
   * @example "test_engineer"
   */
  username: string;
  /**
   * Пароль
   * @example "secret123"
   */
  password: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Propellant Impulse API
 * @version 1.0
 * @contact
 *
 * REST API веб-сервиса базы данных видов топлива ЯРД и расчета удельного импульса. Сессионная аутентификация через куки и Redis.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name AppControllerRoot
   * @request GET:/
   */
  appControllerRoot = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/`,
      method: "GET",
      ...params,
    });

  propellants = {
    /**
     * No description
     *
     * @name PropellantFeedControllerGetFeedRoot
     * @request GET:/propellants/feed
     */
    propellantFeedControllerGetFeedRoot: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/propellants/feed`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @name PropellantFeedControllerGetFeedById
     * @request GET:/propellants/feed/{propellant_id}
     */
    propellantFeedControllerGetFeedById: (
      propellantId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/propellants/feed/${propellantId}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @name PropellantDraftControllerGetDraft
     * @request GET:/propellants/draft
     */
    propellantDraftControllerGetDraft: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/propellants/draft`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @name PropellantDraftControllerSaveDraft
     * @request POST:/propellants/draft
     */
    propellantDraftControllerSaveDraft: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/propellants/draft`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @name PropellantDraftControllerPublishDraft
     * @request POST:/propellants/publish
     */
    propellantDraftControllerPublishDraft: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/propellants/publish`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @name PropellantCatalogControllerGetCatalog
     * @request GET:/propellants/catalog
     */
    propellantCatalogControllerGetCatalog: (
      query: {
        max_molar_mass: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/propellants/catalog`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @name PropellantCatalogControllerDeletePropellant
     * @request POST:/propellants/delete/{id}
     */
    propellantCatalogControllerDeletePropellant: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/propellants/delete/${id}`,
        method: "POST",
        ...params,
      }),
  };
  api = {
    /**
     * @description Возвращает список опубликованных рабочих тел. Работает как с авторизацией (указывая is_liked и is_creator), так и для неавторизованных гостей.
     *
     * @tags Propellants (Рабочие тела / Услуги)
     * @name PropellantsApiControllerGetCatalog
     * @summary Получить каталог опубликованных рабочих тел (доступно без авторизации)
     * @request GET:/api/propellants
     */
    propellantsApiControllerGetCatalog: (
      query?: {
        /**
         * Фильтрация по максимальной молярной массе
         * @example 30
         */
        max_molar_mass?: string;
        /**
         * Поиск по наименованию
         * @example "метан"
         */
        query?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PropellantResponseDto[], any>({
        path: `/api/propellants`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Поле creator_id автоматически заполняется идентификатором пользователя из текущей сессии Redis.
     *
     * @tags Propellants (Рабочие тела / Услуги)
     * @name PropellantsApiControllerCreateDraft
     * @summary Создать или обновить черновик рабочего тела (требуется авторизация)
     * @request POST:/api/propellants
     * @secure
     */
    propellantsApiControllerCreateDraft: (
      data: CreatePropellantDto,
      params: RequestParams = {},
    ) =>
      this.request<PropellantResponseDto, void>({
        path: `/api/propellants`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает текущую карточку рабочего тела для ленты рекомендаций. Работает без авторизации.
     *
     * @tags Propellants (Рабочие тела / Услуги)
     * @name PropellantsApiControllerGetFeed
     * @summary Получить карточку для ленты (доступно без авторизации)
     * @request GET:/api/propellants/feed
     */
    propellantsApiControllerGetFeed: (
      query?: {
        /** Текущий идентификатор рабочего тела */
        id?: string;
        /** Флаг запроса следующей записи (true/false) */
        next?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PropellantResponseDto, any>({
        path: `/api/propellants/feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Propellants (Рабочие тела / Услуги)
     * @name PropellantsApiControllerGetDraft
     * @summary Получить черновик текущего пользователя (требуется авторизация)
     * @request GET:/api/propellants/draft
     * @secure
     */
    propellantsApiControllerGetDraft: (params: RequestParams = {}) =>
      this.request<PropellantResponseDto, void>({
        path: `/api/propellants/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Без авторизации возвращает 401 Unauthorized. При наличии валидной сессии обновляет переданные поля и возвращает 200 OK.
     *
     * @tags Propellants (Рабочие тела / Услуги)
     * @name PropellantsApiControllerUpdate
     * @summary Обновить рабочее тело (услугу) по ID (требуется авторизация)
     * @request PUT:/api/propellants/{id}
     * @secure
     */
    propellantsApiControllerUpdate: (
      id: number,
      data: UpdatePropellantDto,
      params: RequestParams = {},
    ) =>
      this.request<PropellantResponseDto, void>({
        path: `/api/propellants/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Propellants (Рабочие тела / Услуги)
     * @name PropellantsApiControllerDelete
     * @summary Удалить рабочее тело (soft delete, требуется авторизация)
     * @request DELETE:/api/propellants/{id}
     * @secure
     */
    propellantsApiControllerDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/propellants/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Propellants (Рабочие тела / Услуги)
     * @name PropellantsApiControllerPublish
     * @summary Опубликовать черновик рабочего тела (требуется авторизация)
     * @request PUT:/api/propellants/{id}/publish
     * @secure
     */
    propellantsApiControllerPublish: (
      id: number,
      data: PublishPropellantDto,
      params: RequestParams = {},
    ) =>
      this.request<PropellantResponseDto, void>({
        path: `/api/propellants/${id}/publish`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Propellants (Рабочие тела / Услуги)
     * @name PropellantsApiControllerToggleLike
     * @summary Поставить или снять отметку "нравится" (требуется авторизация)
     * @request POST:/api/propellants/{id}/like
     * @secure
     */
    propellantsApiControllerToggleLike: (
      id: number,
      data: LikePropellantDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/propellants/${id}/like`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Создает учетную запись инженера с ролью user
     *
     * @tags Домен пользователей
     * @name AuthApiControllerRegister
     * @summary Регистрация нового пользователя
     * @request POST:/api/auth/register
     */
    authApiControllerRegister: (
      data: RegisterUserDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Проверяет учетные данные, создает сессию в Redis и устанавливает сессионную куку sessionId
     *
     * @tags Домен пользователей
     * @name AuthApiControllerLogin
     * @summary Аутентификация пользователя (Вход)
     * @request POST:/api/auth/login
     */
    authApiControllerLogin: (data: LoginUserDto, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Удаляет сессию из Redis и очищает сессионную куку sessionId
     *
     * @tags Домен пользователей
     * @name AuthApiControllerLogout
     * @summary Деавторизация пользователя (Выход)
     * @request POST:/api/auth/logout
     */
    authApiControllerLogout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/logout`,
        method: "POST",
        ...params,
      }),

    /**
     * @description Требует валидной сессии sessionId
     *
     * @tags Домен пользователей
     * @name AuthApiControllerGetMe
     * @summary Получение профиля текущего авторизованного пользователя
     * @request GET:/api/auth/me
     * @secure
     */
    authApiControllerGetMe: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/auth/me`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
}
