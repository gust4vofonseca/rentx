import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsReposityInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DaysjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsReposityInMemory: RentalsReposityInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dateProvider: DayjsDateProvider;

describe("Create rental", () => {
    const dayAdd24Hours = dayjs().add(1, "day").toDate();
    beforeEach(() => {
        rentalsReposityInMemory = new RentalsReposityInMemory();
        dateProvider = new DayjsDateProvider();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createRentalUseCase = new CreateRentalUseCase(
            rentalsReposityInMemory,
            dateProvider,
            carsRepositoryInMemory
        );
    });

    it("should be able to create a new rental", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Test",
            description: "CarTest",
            daily_rate: 100,
            license_plate: "teste",
            fine_amount: 40,
            category_id: "1234",
            brand: "BrandTest",
        });

        const rental = await createRentalUseCase.execute({
            user_id: "12345",
            car_id: car.id,
            expected_return_date: dayAdd24Hours,
        });

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it("should not be able to create a new rental if there is another open to the same user", async () => {
        await rentalsReposityInMemory.create({
            car_id: "121212",
            expected_return_date: dayAdd24Hours,
            user_id: "12345",
        });

        await expect(
            createRentalUseCase.execute({
                user_id: "12345",
                car_id: "12121",
                expected_return_date: dayAdd24Hours,
            })
        ).rejects.toEqual(
            new AppError("There's a rental in progress for user!")
        );
    });

    it("should not be able to create a new rental if there is another open to the same car", async () => {
        await rentalsReposityInMemory.create({
            car_id: "121212",
            expected_return_date: dayAdd24Hours,
            user_id: "12345",
        });

        expect(
            createRentalUseCase.execute({
                user_id: "3245",
                car_id: "12121121",
                expected_return_date: dayAdd24Hours,
            })
        ).rejects.toEqual(new AppError("Car is unavailable"));
    });

    it("should not be able to create a new rental with invalid return time", async () => {
        await expect(
            createRentalUseCase.execute({
                user_id: "12345",
                car_id: "12121121",
                expected_return_date: dayjs().toDate(),
            })
        ).rejects.toEqual(new AppError("Invalid return time!"));
    });
});
