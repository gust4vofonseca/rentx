import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ListAvailableCarsUseCase } from "@modules/cars/useCases/listAvailableCars/ListAvailableCarsUseCase";

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("List Cars", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        listAvailableCarsUseCase = new ListAvailableCarsUseCase(
            carsRepositoryInMemory
        );
    });

    it("should be able to list all available cars", async () => {
        const car = await carsRepositoryInMemory.create({
            brand: "Car_brand",
            category_id: "category_id",
            daily_rate: 120,
            description: "CarDescription",
            fine_amount: 70,
            name: "Car1",
            license_plate: "Car-1234",
        });

        const cars = await listAvailableCarsUseCase.execute({});

        expect(cars).toEqual([car]);
    });

    it("should be able to list all available cars by brand", async () => {
        const car = await carsRepositoryInMemory.create({
            brand: "Car_brand_teste",
            category_id: "category_id",
            daily_rate: 120,
            description: "CarDescription",
            fine_amount: 70,
            name: "Car2",
            license_plate: "Car-1235",
        });

        const cars = await listAvailableCarsUseCase.execute({
            brand: "Car_brand_teste",
        });

        expect(cars).toEqual([car]);
    });

    it("should be able to list all available cars by name", async () => {
        const car = await carsRepositoryInMemory.create({
            brand: "Car_brand_teste",
            category_id: "category_id",
            daily_rate: 120,
            description: "CarDescription",
            fine_amount: 70,
            name: "Car3",
            license_plate: "Car-1236",
        });

        const cars = await listAvailableCarsUseCase.execute({
            name: "Car3",
        });

        expect(cars).toEqual([car]);
    });

    it("should be able to list all available cars by category", async () => {
        const car = await carsRepositoryInMemory.create({
            brand: "Car_brand_teste",
            category_id: "12345",
            daily_rate: 120,
            description: "CarDescription",
            fine_amount: 70,
            name: "Car3",
            license_plate: "Car-1239",
        });

        const cars = await listAvailableCarsUseCase.execute({
            category_id: "12345",
        });

        expect(cars).toEqual([car]);
    });
});
