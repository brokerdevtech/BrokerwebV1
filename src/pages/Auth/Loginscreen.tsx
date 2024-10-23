import * as React from "react";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  Box,
  Typography,
  Container,
  Grid,
  Link,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { loginUtilitise } from "../../AppCore/services/authService";
import { useAuth } from "../../context/AuthContext";
import { storeTokens } from "../../utils/utilTokens";
import LinearProgress from "../../Components/loading";
import { BrandImage } from "../../Components/Ui/BrandLogo";
import "../../assets/css/style.css"; // Assuming you saved the CSS as SignIn.css
import { HttpsOutlined, Person } from "@mui/icons-material";

const defaultTheme = createTheme();

export default function SignIn() {
  const { login } = useAuth();
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>("");
  const [rememberMe, setRememberMe] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  React.useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    let user: any = {
      email: data.get("email"),
      password: data.get("password"),
    };
    const result = await loginUtilitise(user.email, user.password);
    setLoading(false);
    if (result.status === "error") {
      setMessage(result.error);
    } else {
      await storeTokens(
        result.data.accessToken,
        result.data.refreshToken,
        result.data.getStreamAccessToken
      );
      login(result.data);
      if (rememberMe) {
        localStorage.setItem("email", user.email);
        localStorage.setItem("password", user.password);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }
      setMessage("");
    }
  };

  const handleRememberMeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRememberMe(event.target.checked);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container className="container">
        <div className="screen">
          <div className="screen__content">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <BrandImage />
              <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
                Sign in
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 3 }}
                className="login"
              >
                <div className="login__field">
                  {/* <i className="login__icon fas fa-user"></i> */}
                  <Person className="login__icon" />
                  <input
                    type="email"
                    // margin="normal"
                    required
                    // fullWidth
                    id="email"
                    placeholder="Enter your email address"
                    // label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    // sx={{ backgroundColor: "white", borderRadius: 1 }}
                    className="login__input"
                  />
                </div>
                <div className="login__field">
                  <HttpsOutlined className="login__icon" />
                  <input
                    type="password"
                    // margin="normal"
                    // required
                    // fullWidth
                    name="password"
                    // label="Password"
                    // type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    // sx={{ backgroundColor: "white", borderRadius: 1 }}
                    className="login__input"
                  />
                </div>
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="primary"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                    />
                  }
                  label="Remember me"
                />
                <button className="button login__submit" type="submit">
                  <span className="button__text">
                    {isLoading ? "Please Wait.." : "Sign In"}
                  </span>
                  <i className="button__icon fas fa-chevron-right"></i>
                </button>
                {message !== "" && <Alert severity="error">{message}</Alert>}
              </Box>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                {/* <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid> */}
              </Grid>
            </Box>
            {isLoading && <LinearProgress />}
          </div>
          <div className="screen__background">
            <span className="screen__background__shape screen__background__shape4"></span>
            <span className="screen__background__shape screen__background__shape3"></span>
            <span className="screen__background__shape screen__background__shape2"></span>
            <span className="screen__background__shape screen__background__shape1"></span>
          </div>
        </div>
      </Container>
    </ThemeProvider>
  );
}
