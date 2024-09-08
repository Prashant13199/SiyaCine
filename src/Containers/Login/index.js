import React, { useState } from "react";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth, database } from "../../firebase";
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

export default function Login({ handleClose }) {

    const [loading, setLoading] = useState(false);
    const [loginMode, setLoginMode] = useState(true)
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

    const handleMode = () => {
        setLoginMode(!loginMode)
    }

    const login = async () => {
        setLoading(true);
        const user = await auth.signInWithEmailAndPassword(email, password).then((user) => {
            database.ref(`Users/${user.user.uid}`).update({
                timestamp: Date.now(),
            }).then(() => {
                setLoading(false);
                localStorage.setItem('uid', user.user.uid)
                handleClose()
                window.location.reload()
            }).catch((e) => {
                setLoading(false);
                setError(e.toString())
                setShow(true)
            });
        }).catch((e) => {
            console.log(e);
            setLoading(false);
            setError(e.toString())
            setShow(true)
        });
    };

    const register = async () => {
        setLoading(true);
        const user = auth.createUserWithEmailAndPassword(email, password).then((user) => {
            database.ref(`Users/${user.user.uid}`).update({
                uid: user.user.uid,
                username: email.split('@')[0],
                photo: `https://api.dicebear.com/9.x/dylan/svg?seed=${email.split('@')[0]}?size=96`,
                email: email,
                createdAccountOn: Date.now(),
                timestamp: Date.now(),
                public: false,
                premium: false,
                admin: false
            }).then(() => {
                setLoading(false);
                localStorage.setItem('uid', user.user.uid)
                handleClose()
            }).catch((e) => {
                setLoading(false);
                setError(e.toString())
                setShow(true)
            });
        }).catch((e) => {
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
                    <ForgotPassword handleClose2={handleClose2} />
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

            {loginMode ? <div className="login">
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
                            color="warning"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="d-grid gap-2" style={{ marginTop: "10px" }}>
                        <TextField
                            label="Password"
                            variant="standard"
                            color="warning"
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
                            variant="warning"
                            size="md"
                            id="uploadBtn"
                            onClick={() => login()}
                        >
                            {loading ? "Please Wait.." : "Login"}
                        </Button>
                    </div>
                    <div className="d-grid gap-2" style={{ marginTop: "10px", cursor: 'pointer' }}>
                        <a className="a_link" href="#" onClick={() => handleShow2()} style={{ textDecoration: 'none', color: theme.palette.warning.main }}>Forgot Password?</a>
                    </div>
                    <div className="d-grid gap-2" style={{ marginTop: "10px", cursor: 'pointer' }}>
                        <a className="a_link" href="#" onClick={() => handleMode()} style={{ textDecoration: 'none', color: theme.palette.warning.main }}>Don't have an account?</a>
                    </div>
                    <GoogleSignin close={handleClose} />
                </div>
            </div>
                :
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
                                color="warning"
                                variant="standard"
                                type="email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="d-grid gap-2" style={{ marginTop: "10px" }}>
                            <TextField
                                label="Password"
                                color="warning"
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
                                variant="warning"
                                size="md"
                                id="uploadBtn"
                                onClick={() => register()}
                            >
                                {loading ? "Please Wait.." : "Register"}
                            </Button>
                        </div>
                        <div className="d-grid gap-2" style={{ marginTop: "10px", cursor: 'pointer' }}>
                            <a href="#" onClick={() => handleMode()} style={{ textDecoration: 'none', color: theme.palette.warning.main }}>Already have an account?</a>
                        </div>
                        <GoogleSignin close={handleClose2} />
                    </div>
                </div>
            }
        </>
    );
}