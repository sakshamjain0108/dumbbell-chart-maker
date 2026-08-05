import { useState } from 'react';
import { Download, Plus, X, Sun, Moon } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import DumbbellChart from './components/DumbbellChart';

function App() {
  const [title, setTitle] = useState('Total fertility rate (children per woman)');
  const [rows, setRows] = useState([
    { id: '1', label: 'NFHS-4', from: 2.2, to: 2.3, fromLabel: 'India', toLabel: 'MP' },
    { id: '2', label: 'NFHS-5', from: 2.0, to: 2.0, fromLabel: 'India / MP', toLabel: '' },
    { id: '3', label: 'NFHS-6', from: 2.0, to: 2.1, fromLabel: 'India', toLabel: 'MP' },
  ]);
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [colorGainsLosses, setColorGainsLosses] = useState(true);
  const [showValues, setShowValues] = useState(true);

  const addRow = () => {
    const newId = Date.now().toString();
    setRows([...rows, { id: newId, label: 'New Row', from: 0, to: 0, fromLabel: '', toLabel: '' }]);
  };

  const removeRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  const updateRow = (id, field, value) => {
    setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const downloadImage = (format) => {
    const node = document.getElementById('chart-container');
    if (!node) return;

    // Apply scale to make it crisp
    const scale = 2;
    const style = {
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      width: node.offsetWidth + 'px',
      height: node.offsetHeight + 'px',
    };

    const param = {
      height: node.offsetHeight * scale,
      width: node.offsetWidth * scale,
      style
    };

    if (format === 'png') {
      htmlToImage.toPng(node, param)
        .then(function (dataUrl) {
          const link = document.createElement('a');
          link.download = 'dumbbell-chart.png';
          link.href = dataUrl;
          link.click();
        });
    } else if (format === 'svg') {
      htmlToImage.toSvg(node, param)
        .then(function (dataUrl) {
          const link = document.createElement('a');
          link.download = 'dumbbell-chart.svg';
          link.href = dataUrl;
          link.click();
        });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Sidebar Controls */}
      <aside className={`w-full md:w-96 p-6 border-r flex flex-col gap-6 overflow-y-auto ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dumbbell Chart Maker</h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Configure your chart parameters below.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Chart Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Rows Data</label>
              <button onClick={addRow} className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1 font-medium">
                <Plus size={16} /> Add Row
              </button>
            </div>
            
            <div className="space-y-3">
              {rows.map((row) => (
                <div key={row.id} className={`p-3 border rounded-lg relative ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <button onClick={() => removeRow(row.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                  
                  <div className="space-y-2 mb-2">
                     <div>
                        <label className="text-xs text-gray-500 mb-1 block">Label</label>
                        <input 
                          type="text" 
                          value={row.label}
                          onChange={(e) => updateRow(row.id, 'label', e.target.value)}
                          className={`w-full p-1.5 border rounded text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        />
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">From</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={row.from}
                        onChange={(e) => updateRow(row.id, 'from', parseFloat(e.target.value))}
                        className={`w-full p-1.5 border rounded text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">To</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={row.to}
                        onChange={(e) => updateRow(row.id, 'to', parseFloat(e.target.value))}
                        className={`w-full p-1.5 border rounded text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">From Label</label>
                      <input 
                        type="text" 
                        value={row.fromLabel}
                        placeholder="e.g. India"
                        onChange={(e) => updateRow(row.id, 'fromLabel', e.target.value)}
                        className={`w-full p-1.5 border rounded text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">To Label</label>
                      <input 
                        type="text" 
                        value={row.toLabel}
                        placeholder="e.g. MP"
                        onChange={(e) => updateRow(row.id, 'toLabel', e.target.value)}
                        className={`w-full p-1.5 border rounded text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 mt-4 space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Theme</span>
                <div className={`flex p-1 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                   <button 
                     onClick={() => setIsDarkMode(false)} 
                     className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${!isDarkMode ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                   >
                      <Sun size={14} /> Light
                   </button>
                   <button 
                     onClick={() => setIsDarkMode(true)} 
                     className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${isDarkMode ? 'bg-gray-700 shadow text-white' : 'text-gray-500'}`}
                   >
                      <Moon size={14} /> Dark
                   </button>
                </div>
             </div>

             <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={colorGainsLosses}
                  onChange={(e) => setColorGainsLosses(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Color gains/losses</span>
             </label>

             <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showValues}
                  onChange={(e) => setShowValues(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Show values</span>
             </label>
          </div>
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 p-8 flex flex-col items-center justify-center overflow-x-auto relative">
         <div className="w-full max-w-4xl">
            {/* Chart Container */}
            <div 
              id="chart-container" 
              className={`w-full p-8 rounded-xl shadow-sm border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
            >
               <DumbbellChart 
                  title={title} 
                  rows={rows} 
                  isDarkMode={isDarkMode} 
                  colorGainsLosses={colorGainsLosses} 
                  showValues={showValues} 
               />
            </div>

            {/* Export Buttons */}
            <div className="flex gap-4 mt-8 justify-center">
              <button 
                onClick={() => downloadImage('png')}
                className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors shadow-sm font-medium"
              >
                <Download size={18} /> Download PNG
              </button>
              <button 
                onClick={() => downloadImage('svg')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border transition-colors shadow-sm font-medium ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-900'}`}
              >
                <Download size={18} /> Download SVG
              </button>
            </div>
         </div>
      </main>

    </div>
  );
}

export default App;
