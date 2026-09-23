const users = [];

export function createUser({ name, email }) {
    const newUser = {
        id: users.length + 1,
        name,
        email
    };

    users.push(newUser);
    return newUser;
}