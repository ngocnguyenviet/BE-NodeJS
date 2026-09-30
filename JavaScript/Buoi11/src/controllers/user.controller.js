import {
    createUser as createUserService
} from "../services/user.service.js";

export function createUser(req, res) {
    const { name, email } = req.body;

    const newUser = createUserService({
        name, email
    });

    return res.status(201).json({
        message: "Tao user thanh cong",
        user: newUser
    });
}