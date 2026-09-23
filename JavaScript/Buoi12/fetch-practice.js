const newUser = {
    name: "Bình",
    email: "binh@example.com"
};

fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(newUser)
})
    .then((response) => {
        console.log("Status:", response.status);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
    })
    .then((data) => {
        console.log("Server trả về:", data);
    })
    .catch((error) => {
        console.error("Có lỗi:", error.message);
    });

console.log("Đã gửi request");