import { createUser as createUserService } from "../services/user.service.js";

export function createUser(req, res) {
    const { name, email } = req.body;
    const user = createUserService({ name, email });

    return res.status(201).json({
        message: "Tạo user thành công",
        user
    });
}
