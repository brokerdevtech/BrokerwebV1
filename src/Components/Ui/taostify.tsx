import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// interface IMyProps {
//     onClose: any,
//     severity:any,
//     sx:any
// }

// const Alert = React.forwardRef(function Alert(props:IMyProps) {
//     return <MuiAlert elevation={6} variant="filled" {...props} />;
// });
export const Toastify =({isOpen, type, text, close}:any)=>{
    const [open, setOpen] = React.useState(isOpen);
    const handleClose = () => {
        // if (reason === 'clickaway') {
        //   return;
        // }        
        setOpen(false);
        close();
    };
    
    return(
        <Snackbar open={open} autoHideDuration={3000}>
            <MuiAlert elevation={6} variant="filled"  onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                {text}
            </MuiAlert>
        </Snackbar>
    )
}