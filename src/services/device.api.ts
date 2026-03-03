// get full device category details

import { DeviceCategory, DeviceCategoryPagination } from '@/types/deviceCategory'
import { BaseDataInterface } from '@/types/shared'
import { AxiosInstance } from 'axios'

export class DeviceCategoryApi {
    private endpoint = '/device-categories'
    private axios: AxiosInstance
    constructor(axios:AxiosInstance){
        this.axios = axios
    }

    async getDeviceCategories(excludeDeviceCategoryId: string):Promise<DeviceCategoryPagination> {
        try {
            const response = await this.axios.get(this.endpoint, {
                params: {
                    exclude: excludeDeviceCategoryId
                }
            })
            return response.data
        } catch (error) {
            console.error('Error fetching device categories:', error)
            throw error
        }
    }

    async getDeviceCategoryDetails(id: string):Promise<BaseDataInterface<DeviceCategory>> {
        try {
            const response = await this.axios.get(`${this.endpoint}/${id}`)
            return response.data
        } catch (error) {
            console.error('Error fetching device category details:', error)
            throw error
        }
    }
}