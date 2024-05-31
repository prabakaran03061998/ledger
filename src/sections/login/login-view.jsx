import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import useApiService from 'src/services/api_services';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import GradientProgress from 'src/components/progress/gradientProgress';

import { authlogin } from '../../redux/authSlice';





// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();
  const auth = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const {signin}=useApiService();

  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [progressLoading, setProgressLoading] = useState(true);


  const [user, setUser] = useState({ 'email': "", 'password': "" });

  const checkLogin = useCallback(() => {
    if (auth.isAuthenticated) {
      setLoggedIn(true);
      router.push("/"); // Redirect to dashboard if logged in
    }
    setProgressLoading(false);
  }, [router, auth]);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  const goToRegister = () => {
    router.push('/register');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const login = async () => {
    if (user.email !== "" && user.password !== "") {
      const response = await signin(user);
      console.log('response', response);
      if (response.status === "OK") {
        const token = response.info.accessToken;
        const userInfo = response.info.user;
        dispatch(authlogin({ userInfo, token }));
        router.push("/");
      }
    }
  }



  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="email"
          label="Email address"
          value={user.email || ''}
          onChange={handleChange}
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={user.password || ''}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={login}
      >
        Login
      </LoadingButton>
    </>
  );



  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        {progressLoading || loggedIn ? <GradientProgress/> : <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Sign in to Ledger</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don’t have an account?
            <Link onClick={goToRegister} variant="subtitle2" sx={{ ml: 0.5 }}>
              Get started
            </Link>
          </Typography>

          <Stack direction="row" spacing={2}>
            {/* <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:google-fill" color="#DF3E30" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:facebook-fill" color="#1877F2" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
            </Button> */}
          </Stack>

          {/* <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography>
          </Divider> */}

          {renderForm}
        </Card>}
      </Stack>

    </Box>
  );
}
