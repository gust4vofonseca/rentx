import { RentalsReposityInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsReposityInMemory: RentalsReposityInMemory;

describe("Create rental", () => {
    beforeEach(() => {
        rentalsReposityInMemory = new RentalsReposityInMemory();
        createRentalUseCase = new CreateRentalUseCase(rentalsReposityInMemory);
    });

    it("should be able to create a new rental", async () => {
        const rental = await createRentalUseCase.execute({
            user_id: "12345",
            car_id: "12121121",
            expected_return_date: new Date(),
        });

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it("should not be able to create a new rental if there is another open to the same user", async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                user_id: "12345",
                car_id: "12121121",
                expected_return_date: new Date(),
            });
            await createRentalUseCase.execute({
                user_id: "12345",
                car_id: "12121",
                expected_return_date: new Date(),
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create a new rental if there is another open to the same car", async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                user_id: "12345",
                car_id: "12121121",
                expected_return_date: new Date(),
            });
            await createRentalUseCase.execute({
                user_id: "3245",
                car_id: "12121121",
                expected_return_date: new Date(),
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});
