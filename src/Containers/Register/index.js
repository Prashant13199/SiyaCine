import React, { useState } from "react";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TextField from "@mui/material/TextField";
import { IconButton, InputAdornment } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { database, auth } from "../../firebase";
import GoogleSignin from "../../Components/GoogleSignin";

export default function Register() {

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const [show, setShow] = useState(false);
    const [error, setError] = useState("")
    const avatarArray = ['Willow', 'Spooky', 'Bubba', 'Lily', 'Whiskers', 'Pepper', 'Tiger', 'Zoey', 'Dusty', 'Simba']
    const register = async () => {
        setLoading(true);
        auth.createUserWithEmailAndPassword(email, password).then((user) => {
            setLoading(false);
            database.ref(`Users/${user.user.uid}`).update({
                uid: user.user.uid,
                username: email.replace("@gmail.com", ""),
                photo: `https://api.dicebear.com/6.x/thumbs/png?seed=${avatarArray[Math.ceil(Math.random() * 10)]}`,
                email: email,
                createdAccountOn: Date.now(),
                timestamp: Date.now(),
            })
                .then(() => {
                    setLoading(false);
                    window.location.reload()
                })
                .catch((e) => {
                    setLoading(false);
                    setError(e)
                    setShow(true)
                });
        })
            .catch((e) => {
                console.log(e);
                setLoading(false);
                setError(e)
                setShow(true)
            });
    };
    return (
        <>
            {show && <Alert variant="danger" onClose={() => {
                setShow(false)
                setError("")
            }
            } dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <div>
                    {error}
                </div>
            </Alert>}
            <div className="login">
                <div className="login__container">
                    <div className="login__text">
                        <h4>
                            Register
                        </h4>
                    </div>
                    <div className="d-grid gap-2">
                        <TextField
                            label="Email"
                            variant="standard"
                            type="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="d-grid gap-2" style={{ marginTop: "10px" }}>
                        <TextField
                            label="Password"
                            variant="standard"
                            type={showPassword ? "text" : "password"}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="d-grid gap-2" style={{ marginTop: "20px" }}>
                        <Button
                            variant="primary"
                            size="md"
                            id="uploadBtn"
                            onClick={register}
                            style={{
                                color: "white",
                                cursor: "pointer",
                            }}
                        >
                            {loading ? "Please Wait.." : "Register"}
                        </Button>
                    </div>
                    <GoogleSignin />
                </div>
            </div>
        </>
    );
}