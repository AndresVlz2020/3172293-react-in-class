import { useState } from "react";
import { loginSchema } from "../schemas/loginSchema";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { Input, Button } from "@/shared"
// import { SquareArrowRightEnter, Menu } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userEmail: "",
        userPassword: "",
    })

    const [errors, setErrors] = useState({})

    // =========================
    //      Handle Generico
    // =========================
    /**
     * Función que se ejecuta cada vez que cambia el valor de un input del formulario
     */

    const handleChange = (e) => {
        // Se obtiene el nombre del campo y su valor
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            // Se copian todos los valores anteriores del estado
            ...prev,

            // Se actualiza unicamente lo que cambió
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // =========================
    //      Handle Submit
    // =========================
    /**
     * Función que se ejecuta cuando se envia el formulario
     */

    // submit real + guardar token

    const handleSubmit = async (e) => {
        e.preventDefault()

        const result = loginSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});

        try {
            const data = await login(result.data);

            console.log("LOGIN RESPONSE: ", data);

            if (data.token) {
                sessionStorage.setItem("token", data.token);
            }
            if (data.user) {
                sessionStorage.setItem("user", JSON.stringify(data.user));
            }

            // navigate("/"); // o dashboard
            navigate("/dashboard/userList");
        } catch (error) {
            alert(error.message);
        }
    };

    const handleCancel = () => {
        setFormData({
            userEmail: "",
            userPassword: "",
        });
        setErrors({});
    };

    return (
        <div className="flex flex-col justify-center h-screen">
            <h1 className="text-text-primary text-2xl mb-6 text-center pt-6">
                Inicio de sesión
            </h1>

            <form
                className="grid grid-cols-1 items-center gap-6"
                onSubmit={handleSubmit} 
            >
                {/* Inputs */}
                <div className="grid grid-cols-1 gap-6 my-auto mx-auto border p-[48px] rounded-[16px]">
                    <Input
                        label="Correo Electrónico"
                        name="userEmail"
                        type="email"
                        placeholder="Ingrese su correo"
                        value={formData.userEmail}
                        onChange={handleChange}
                        error={errors.userEmail}
                    />

                    <Input
                        label="Contraseña"
                        name="userPassword"
                        placeholder="Ingrese su contraseña"
                        type="password"
                        value={formData.userPassword}
                        onChange={handleChange}
                        error={errors.userPassword} 
                    />

                    {/* Actions */}
                    <div className="flex items-end justify-end gap-12">
                        <Button
                            variant="secondary"
                            size="sm"
                            type="button"
                            onClick={handleCancel}
                        >
                            Cancelar
                        </Button>

                        <Button
                            variant="primary"
                            size="md"
                            type="submit"
                        >
                            Ingresar
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}