export interface ICarData {
    carId: string;
    sensorId: string;
    sensorType: string;
    sensorValue: string;
    sensorUnit: string;
    sensorTimestamp: string;
    currentSpeed: number;
  positions: Iposition[];
    isMoving: boolean;
    lastMovementTimestamp: string;
    hotData: boolean;
}

export interface Iposition {
    carId: string;
    latitude: number;
    longitude: number;
}
