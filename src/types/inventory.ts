import { InventoryStatusEnum } from "@/enum/inventory.enum";



export interface CheckInventoryAvailabilityResponse {
    deviceCategoryId: string;
    productName: string;
    availableQuantity: number;
    safetyStockThreshold: number;
    status: InventoryStatusEnum;
    _id: string;
}