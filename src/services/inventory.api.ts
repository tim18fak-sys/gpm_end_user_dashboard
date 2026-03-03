import { CheckInventoryAvailabilityResponse } from "@/types/inventory"
import { BaseDataInterface } from "@/types/shared"
import { AxiosInstance } from "axios"

export class InventoryApi {
    private endpoint = '/v1/inventory-management/lead'
    private api: AxiosInstance
    constructor(api:AxiosInstance){
        this.api = api
    }

    async checkDeviceAvailability(deviceCategoryId: string):Promise<BaseDataInterface<CheckInventoryAvailabilityResponse>> {
        try {
            const response = await this.api.get(`${this.endpoint}/check-availability/${deviceCategoryId}`)
            return response.data
        } catch (error) {
            console.error('Error checking device availability:', error)
            throw error
        }
    }
}

import { api } from './api'
export const inventoryApi = new InventoryApi(api)