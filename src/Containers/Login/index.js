import React, { useState } from "react";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth } from "../../firebase";
import TextField from "@mui/material/TextField";
import { IconButton, InputAdornment } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import ForgotPassword from "../ForgotPassword";
import GoogleSignin from "../../Components/GoogleSignin";
import { useTheme } from '@mui/material/styles';

export default function Login() {

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const [show, setShow] = useState(false);
    const [error, setError] = useState('')

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);
    const theme = useTheme()

    const login = async () => {
        setLoading(true);
        const user = await auth.signInWithEmailAndPassword(email, password).then((user) => {
            setLoading(false);
            window.location.reload();
        })
            .catch((e) => {
                console.log(e);
                setLoading(false);
                setError(e.toString())
                setShow(true)
            });
    };
    return (
        <>
            <Modal show={show2} onHide={handleClose2} centered>
                <Modal.Body style={{ backgroundColor: theme.palette.background.default }}>
                    <ForgotPassword />
                </Modal.Body>
            </Modal>
            {show && <Alert variant="danger" onClose={() => {
                setShow(false)
                setError("")
            }
            } dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <div style={{ fontSize: 'small' }}>
                    {error}
                </div>
            </Alert>}

            <div className="login">
                <div className="login__container">
                    <div className="login__text">
                        <h4>
                            Login
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
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <br />
                    <div className="d-grid gap-2" style={{ marginTop: "20px" }}>
                        <Button
                            variant="primary"
                            size="md"
                            id="uploadBtn"
                            onClick={login}
                            style={{
                                color: "white",
                                cursor: "pointer",
                            }}
                        >
                            {loading ? "Please Wait.." : "Login"}
                        </Button>
                    </div>
                    <div className="d-grid gap-2" style={{ marginTop: "10px", cursor: 'pointer' }}>
                        <a href="#" onClick={() => handleShow2()} style={{ textDecoration: 'none' }}>Forgot Password?</a>
                    </div>
                    <GoogleSignin />
                </div>
            </div>
        </>
    );
}