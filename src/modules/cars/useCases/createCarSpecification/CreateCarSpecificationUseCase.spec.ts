import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe("Create car Specification", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        specificationsRepositoryInMemory =
            new SpecificationsRepositoryInMemory();
        createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
            carsRepositoryInMemory,
            specificationsRepositoryInMemory
        );
    });

    it("should not be able to add a ner specification to a now-existent car", async () => {
        const car_id = "1234";
        const specification_id = ["54312"];

        await expect(
            createCarSpecificationUseCase.execute({
                car_id,
                specification_id,
            })
        ).rejects.toEqual(new AppError("Car does not exists!"));
    });

    it("should be able to add a ner specification to the car", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "new car",
            description: "Description car test",
            daily_rate: 100,
            license_plate: "ABC-1235",
            fine_amount: 60,
            brand: "Brand",
            category_id: "category",
        });

        const specification = await specificationsRepositoryInMemory.create({
            description: "test",
            name: "Test",
        });

        const specificationsCars = await createCarSpecificationUseCase.execute({
            car_id: car.id,
            specification_id: [specification.id],
        });

        expect(specificationsCars).toHaveProperty("specifications");
        expect(specificationsCars.specifications.length).toBe(1);
    });
});
