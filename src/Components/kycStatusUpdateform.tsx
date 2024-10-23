import React, { useState } from 'react';
import Button from '@mui/material/Button';
import {commonColor} from '../theme/colors';
import FormHelperText from '@mui/material/FormHelperText';
import {GetAWSSignedURL} from '../AppCore/services/awsServices';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ClearIcon from '@mui/icons-material/Clear';


function KycStatusForm(props:any) {
    // console.log(props)
  const selectedItem = props?.selectedRow;
  const [formData, setFormData] = useState({
    status: (props?.selectedRow?.kycStatus !== "Pending Approval") ? "": "1", // Default status
    description: '',
    userId:props?.selectedRow?.userId,
  });
  const [errorMsg, seterrorMsg] = useState("");
  const [reraImage, setreraImage] = useState("");
  const [addressImage, setAddressImage] = useState("");
  const [uidImage, setuidImage] = useState("");
  // console.log(selectedItem.reraRegistrationBlob.slice(((selectedItem.reraRegistrationBlob.lastIndexOf(".") - 1) >>> 0) + 2))
  React.useEffect(()=>{
    const getSignedurl = async ()=>{
      const reraImageUrl = await GetAWSSignedURL("kycbrokerapp", selectedItem.reraRegistrationBlob);
      const addressImageUrl = await GetAWSSignedURL("kycbrokerapp", selectedItem.addressProofBlob);
      const uidImageUrl = await GetAWSSignedURL("kycbrokerapp", selectedItem.uidNumberBlob);
      if(reraImageUrl){
        setreraImage(reraImageUrl) 
      }
      if(addressImageUrl){
        setAddressImage(addressImageUrl) 
      }
      if(uidImageUrl){
        setuidImage(uidImageUrl) 
      }
    }
    getSignedurl();
    
  },[])

  const handleStatusChange = (event:any) => {
    setFormData({
      ...formData,
      status: event.target.value,
    });
  };

  const handleDescriptionChange = (event:any) => {
    setFormData({
      ...formData,
      description: event.target.value,
    });
  };

  const handleSubmit = (event:any) => {
    event.preventDefault();
    // You can perform actions with the form data here, e.g., send it to an API
    // console.log('Form Data:', formData);
    if(formData.status === '' || formData.description === ''){
        seterrorMsg("Please fill all the mandatory fields");
        return;
    } 
    props.onSubmit(formData);

  };
  const handleClear = () => {
    props.clearModal();
    // window.location.reload()
  };

  return (
    <div>
      <div style={{display:'flex' ,alignItems:'center ' , justifyContent:'space-between'}}>
        <label><strong>Documents</strong></label>
        <ClearIcon onClick={handleClear}  style={{cursor:'pointer'}}/>
        </div>
      
      <div style={{display:'flex', justifyContent:"space-between"}}>
       {reraImage !=="" && (
        <div className='kycDocImages'>
          <p>RERA</p>
          <a href={reraImage} target='_blank'>
          {selectedItem.reraRegistrationBlob.slice(((selectedItem.reraRegistrationBlob.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase() == "pdf" ?(
            <PictureAsPdfIcon sx={{ fontSize: 60 }} />
          ) :(
            <img src={reraImage} />
          )}
          </a>
        </div>
       )}
       {addressImage !=="" && (
        <div className='kycDocImages'>
          <p>Address</p>
          <a href={addressImage} target='_blank'>
          {selectedItem.addressProofBlob.slice(((selectedItem.addressProofBlob.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase() == "pdf" ?(
            <PictureAsPdfIcon sx={{ fontSize: 60 }} />
          ) :(
            <img src={reraImage} />
          )}  
          </a>
        </div>
       )}
       {uidImage !=="" && (
        <div className='kycDocImages'>
          <p>UID Number</p>
          <a href={uidImage} target='_blank'>
          {selectedItem.uidNumberBlob.slice(((selectedItem.uidNumberBlob.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase() == "pdf" ?(
            <PictureAsPdfIcon sx={{ fontSize: 60 }} />
          ) :(
            <img src={reraImage} />
          )}  
          </a>
        </div>
       )}
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom:"15px"}}>
          <div>
            <label><strong>Status:</strong><span style={{color:commonColor.redColor}}>*</span></label>
          </div>
          <input
            type="radio"
            name="status"
            value="1"
            checked={formData.status === "1"}
            onChange={handleStatusChange}
          />
          <label>Accept</label>
          <input
            type="radio"
            name="status"
            value="0"
            checked={formData.status !== '' && formData.status !== '1'}
            onChange={handleStatusChange}
          />
          <label>Reject</label>
          
        </div>
        <input
            type="hidden"
            name="userId"
            value={selectedItem?.userId}
            onChange={handleStatusChange}
        />
        <div style={{marginBottom:"15px"}}>
          <div>
            <label><strong>Description:</strong><span style={{color:commonColor.redColor}}>*</span></label>
          </div>
          <textarea
            value={formData.description}
            onChange={handleDescriptionChange}
            rows={4}
            cols={50}
            maxLength={200}
            style={{resize:'none'}}
          />
          <FormHelperText>Upto 200 characters</FormHelperText>
        </div>
        <div>
          {errorMsg !== "" && <div style={{color:commonColor.redColor, fontSize:"16px"}}>{errorMsg}</div>}
          <Button type="submit" color="primary" variant='contained'>Submit</Button>
        </div>
      </form>
    </div>
  );
}

export default KycStatusForm;