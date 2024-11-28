const video = document.getElementById("video");
const captureButton = document.getElementById("capture-btn");

navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((error) => {
    alert("Kameraga ruxsat berilmadi yoki xato yuz berdi.");
    console.error(error);
  });

captureButton.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL("image/png");

  // Convert the image data URL to a Blob
  const byteString = atob(imageData.split(",")[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([uint8Array], { type: "image/png" });

  const formData = new FormData();
  formData.append("file", blob, "image.png");

  fetch("http://16.171.2.140:3000/photos/uploadfile", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Rasm muvaffaqiyatli yuborildi:", data);
    })
    .catch((error) => {
      console.error("Rasm yuborishda xato yuz berdi:", error);
    });
});
