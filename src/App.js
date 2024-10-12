import React, {useState, useRef, useEffect} from 'react';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [filter, setFilter] = useState('none');

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (image) {
      drawImage();
    }
  }, [image, brightness, contrast, saturation, filter]);

  const loadImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => setImage(img);
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    if (filter !== 'none') {
      ctx.filter += ` ${filter}(100%)`;
    }

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setFilter('none');
  };

  const saveImage = () => {
    const link = document.createElement('a');
    link.download = 'edited_image.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="App">
      <div className="canvas-container">
        <canvas ref={canvasRef}></canvas>
      </div>
      <div className="toolbar">
        <input type="file" onChange={loadImage} ref={fileInputRef} accept="image/*" />
        <div className="filter-controls">
          <label>
            Brightness:
            <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(e.target.value)} />
          </label>
          <label>
            Contrast:
            <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(e.target.value)} />
          </label>
          <label>
            Saturation:
            <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(e.target.value)} />
          </label>
          <label>
            Filter:
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="none">None</option>
              <option value="grayscale">Grayscale</option>
              <option value="sepia">Sepia</option>
              <option value="invert">Invert</option>
            </select>
          </label>
        </div>
        <button onClick={resetFilters}>Reset</button>
        <button onClick={saveImage}>Save</button>
      </div>
    </div>
  );
}

export default App;