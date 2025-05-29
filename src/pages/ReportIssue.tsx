import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { MapPinIcon as MapPin } from '@heroicons/react/24/outline';
import Map, { Marker } from 'react-map-gl';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';

const issueTypes = [
  'Fire Accident',
  'Flood',
  'Road Damage',
  'Street Light Issue',
  'Hazardous Gas Leak',
  'Others'
];

export default function ReportIssue() {
  const [formData, setFormData] = useState({
    issueType: '',
    description: '',
    name: '',
    phone: '',
    location: { lat: 0, lng: 0 }
  });
  const [files, setFiles] = useState([]);
  const [viewport, setViewport] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    zoom: 12
  });

  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'video/*': ['.mp4', '.mov']
    },
    maxFiles: 3
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('issues')
        .insert([
          {
            type: formData.issueType,
            description: formData.description,
            reporter_name: formData.name,
            reporter_phone: formData.phone,
            location: `POINT(${formData.location.lng} ${formData.location.lat})`,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast.success('Issue reported successfully!');
      // Handle file uploads here
    } catch (error) {
      toast.error('Failed to report issue. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Report an Issue</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Issue Type</label>
          <select
            className="input mt-1"
            value={formData.issueType}
            onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
            required
          >
            <option value="">Select an issue type</option>
            {issueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="input mt-1"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Photos/Videos</label>
          <div {...getRootProps()} className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
            <input {...getInputProps()} />
            <p>Drag & drop files here, or click to select files</p>
            <p className="text-sm text-gray-500">Supported formats: JPEG, PNG, MP4, MOV</p>
          </div>
          {files.length > 0 && (
            <ul className="mt-2 space-y-1">
              {files.map((file) => (
                <li key={file.name} className="text-sm text-gray-600">{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Name (optional)</label>
            <input
              type="text"
              className="input mt-1"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number (optional)</label>
            <input
              type="tel"
              className="input mt-1"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className="h-64 rounded-lg overflow-hidden">
            <Map
              {...viewport}
              onMove={evt => setViewport(evt.viewport)}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            >
              <Marker
                latitude={formData.location.lat}
                longitude={formData.location.lng}
                draggable
                onDragEnd={(e) => setFormData({
                  ...formData,
                  location: { lat: e.lngLat.lat, lng: e.lngLat.lng }
                })}
              >
                <MapPin className="h-6 w-6 text-red-500" />
              </Marker>
            </Map>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Submit Report
        </button>
      </form>
    </div>
  );
}