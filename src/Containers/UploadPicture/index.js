import React, { useState } from "react";
import "./style.css";
import { auth, storage, database } from "../../firebase";
import Compressor from "compressorjs";
import { Button } from "react-bootstrap";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

export default function UploadPicture({ handleClose }) {

  const [compressedFile, setCompressedFile] = useState(null);
  let fileName = "";
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (
      e.target.files[0] &&
      (e.target.files[0].name.toLowerCase().includes(".jpg") ||
        e.target.files[0].name.toLowerCase().includes(".png") ||
        e.target.files[0].name.toLowerCase().includes(".jpeg") ||
        e.target.files[0].name.toLowerCase().includes(".ico"))
    ) {
      setImage(e.target.files[0]);
      var selectedImageSrc = URL.createObjectURL(e.target.files[0]);
      var imagePreview = document.getElementById("image-preview");
      imagePreview.src = selectedImageSrc;
      imagePreview.style.display = "block";
      const image = e.target.files[0];
      if (
        image.name.toLowerCase().includes(".jpg") ||
        image.name.toLowerCase().includes(".png") ||
        image.name.toLowerCase().includes(".jpeg") ||
        image.name.toLowerCase().includes(".ico")
      ) {
        new Compressor(image, {
          quality: 0.4,
          success: (compressedResult) => {
            setCompressedFile(compressedResult);
          },
        });
      } else {
        setCompressedFile(image);
      }
    } else {
      console.log("File not supported")
    }
  };

  const handleUpload = () => {
    if (image) {
      var imageName = auth?.currentUser?.uid;
      if (
        image.name.toLowerCase().includes(".jpg") ||
        image.name.toLowerCase().includes(".png") ||
        image.name.toLowerCase().includes(".jpeg")
      ) {
        fileName = `${imageName}.jpg`;
      } else if (image.name.includes(".gif")) {
        fileName = `${imageName}.gif`;
      } else if (image.name.toLowerCase().includes(".ico")) {
        fileName = `${imageName}.ico`;
      }
      const uploadTask = storage.ref(`images/${fileName}`).put(compressedFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
          document.getElementById("uploadBtn").disabled = true;
          document.getElementById(
            "uploadBtn"
          ).innerHTML = `Uploading ${progress}`;
        },
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(`${fileName}`)
            .getDownloadURL()
            .then((imageUrl) => {
              database.ref(`/Users/${auth?.currentUser?.uid}`).update({
                photo: imageUrl,
              });
              setProgress(0);
              setImage(null);
              document.getElementById("image-preview").style.display = "none";
              handleClose();
              console.log("Picture Updated")
            });
        }
      );
    }
  };
  return (
    <div className="createPost">
      <div className="createPost__loggedIn">
        <div className="createPost__imagePreview">
          <img
            id="image-preview"
            alt="If not visible, try different link"
            style={{
              color: "white",
              height: "50vh",
              width: "100%",
              marginBottom: "20px",
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="createPost__loggedInBottom">
          {!image && (
            <center>
              <br />
              <div
                className="createPost__imageUpload"
                style={{ textAlign: "center" }}
              >

                <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
                  <AddAPhotoIcon style={{ fontSize: "60px" }} />
                </label>

                <input
                  type="file"
                  id="fileInput"
                  accept="image/*,video/*"
                  onChange={handleChange}
                ></input>
              </div>
              <br />
            </center>
          )}
          {image && (
            <div className="d-grid gap-2" style={{ marginTop: "20px" }}>
              <Button
                variant="primary"
                size="md"
                id="uploadBtn"
                onClick={handleUpload}
                style={{
                  color: image ? "white" : "gray",
                  cursor: image ? "pointer" : "default",
                }}
              >
                Upload
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}