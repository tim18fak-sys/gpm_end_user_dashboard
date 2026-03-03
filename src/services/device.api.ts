// get full device category details

import { DeviceCategory, DeviceCategoryPagination } from '@/types/deviceCategory'
import { BaseDataInterface } from '@/types/shared'
import { AxiosInstance } from 'axios'

export interface DeviceCursorPaginationDto {
    limit: number
    prevCursor?: string
    nextCursor?: string
    search?: string
    excludeDeviceCategoryId: string
}

export class DeviceCategoryApi {
    private endpoint = 'lead/device/category'
    private axios: AxiosInstance
    constructor(axios:AxiosInstance){
        this.axios = axios
    }

    async getDeviceCategories(params: DeviceCursorPaginationDto): Promise<DeviceCategoryPagination> {
        try {
            const response = await this.axios.get(this.endpoint, { params })
            return response.data
        } catch (error) {
            console.error('Error fetching device categories:', error)
            throw error
        }
    }

    async getDeviceCategoryDetails(id: string):Promise<BaseDataInterface<DeviceCategory>> {
        try {
            const response = await this.axios.get(`${this.endpoint}/${id}/one`)
            return response.data
        } catch (error) {
            console.error('Error fetching device category details:', error)
            throw error
        }
    }
}

import { api } from './api'
export const deviceCategoryApi = new DeviceCategoryApi(api)