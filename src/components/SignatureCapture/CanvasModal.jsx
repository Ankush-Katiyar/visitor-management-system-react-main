import React, { useRef, useEffect, useState } from "react";
import "./CanvasModal.css";
import Notification from "../notification";

function CanvasModal({ open, setOpenModal, sendDatatoMain, clearCanvas }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#FF0000"; // Red signature color
  }, []);

  useEffect(() => {
    if (clearCanvas) {
      clearCanvasHandler();
    }
  }, [clearCanvas]);

  const startDrawing = (event) => {
    const { offsetX, offsetY } = getPointerPosition(event);
    setIsDrawing(true);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getPointerPosition(event);
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    ctxRef.current.closePath();
  };

  const clearCanvasHandler = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleConfirm = () => {
    const canvas = canvasRef.current;
    if (isCanvasEmpty(canvas)) {
      Notification.showErrorMessage("Info", "Please draw a signature");
      return;
    }

    const base64Signature = canvas.toDataURL("image/png");
    sendDatatoMain(base64Signature);
    setOpenModal(false);
  };

  const isCanvasEmpty = (canvas) => {
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    return !imageData.some((pixel) => pixel !== 0);
  };

  const getPointerPosition = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches ? event.touches[0] : event;
    return {
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top,
    };
  };

  if (!open) return null;

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button type="button" onClick={() => setOpenModal(false)}>X</button>
        </div>
        <div className="title">
          <h1>Sign Below</h1>
        </div>
        <div className="body">
          <canvas
            ref={canvasRef}
            width={300}
            height={200}
            className="signatureCanvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
        <div className="footer">
          <button onClick={clearCanvasHandler} id="retryBtn">Retry</button>
          <button onClick={handleConfirm} id="confirmBtn">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default CanvasModal;
