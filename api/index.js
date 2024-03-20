const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");


mongoose
    .connect("mongodb+srv://tmpjmendoza:Juanpa123@cluster0.vjig3qw.mongodb.net/", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error connecting to MongoDb", err);
    });

app.listen(port, () => {
    console.log("Server is running on port 8000");
});

const User = require("./models/user");
const Order = require("./models/order");
const sendVerificationEmail = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "tmp_jmendoza@accitesz.com",
            pass: "ppqnognojvtomivq"
        }
    })

    const mailOpcions = {
        from: "amazon.com",
        to: email,
        subject: "Email Verification",
        text: `Please click the following link to verify your email: http://192.168.1.86:8000/verify/${verificationToken}`,
    };

    try {
        await transporter.sendMail(mailOpcions);
    } catch (error) {
        console.log("Error de verificacion de email", error);
    }
};


//registro en la aplicacion

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Verifica si ya existe un usuario con el mismo email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El email ya está registrado." });
        }

        // Crea un nuevo usuario
        const newUser = new User({ name, email, password });

        // Genera un token de verificación
        newUser.verificationToken = crypto.randomBytes(20).toString("hex");

        // Guarda el nuevo usuario en la base de datos
        await newUser.save();

        // Envía un correo electrónico de verificación (asumiendo que esta función ya está definida)
        sendVerificationEmail(newUser.email, newUser.verificationToken);

        // Responde con un mensaje de éxito
        res.status(201).json({ message: "Cuenta creada exitosamente. Por favor verifica tu correo electrónico." });
    } catch (error) {
        console.log("Error de registro", error);
        res.status(500).json({ message: "Fallo al registrar." });
    }
});


app.get("/verify/:token", async (req, res) => {
    try {
        const token = req.params.token;

        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(404).json({ message: "invalid verification token" });
        }

        user.verified = true;
        user.verificationToken = undefined;

        await user.save();

        res.status(200).json({ message: "email verification successfull" });
    } catch (error) {
        res.status(500).json({ message: "Email Verification Failed" });
    }
})

const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString("hex");

    return secretKey;
}
const secretKey = generateSecretKey();
//login en la aplicacion 
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "invalid email o password" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "invalid password" });
        }

        const token = jwt.sign({ userId: user._id }, secretKey);

        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
})