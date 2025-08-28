"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, Download, Copy, RotateCcw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface OCRResult {
  text: string;
  confidence: number;
}

type ViewMode = "upload" | "preview" | "result";

export function PassportOCR() {
  const [viewMode, setViewMode] = useState<ViewMode>("upload");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [ocrResults, setOcrResults] = useState<OCRResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter(file => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setSelectedImages(validFiles);
    
    // Create preview URLs
    const urls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    
    setViewMode("preview");
    toast.success(`${validFiles.length} passport image(s) selected`);
  }, []);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processOCR = async () => {
    if (selectedImages.length === 0) return;

    setIsProcessing(true);
    const results: OCRResult[] = [];

    try {
      for (const image of selectedImages) {
        const base64Image = await convertToBase64(image);
        
        const response = await fetch("/api/ocr", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64Image,
            imageType: image.type,
          }),
        });

        if (!response.ok) {
          throw new Error(`OCR processing failed: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.success && data.text) {
          results.push({
            text: data.text,
            confidence: data.confidence || 0,
          });
        } else {
          throw new Error(data.error || "Failed to extract text from passport");
        }
      }

      setOcrResults(results);
      setViewMode("result");
      toast.success("Passport text extracted successfully!");
    } catch (error) {
      console.error("OCR Error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process passport image");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Text copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy text");
    });
  };

  const downloadText = (text: string, index: number) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `passport-ocr-result-${index + 1}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Text file downloaded!");
  };

  const resetTool = () => {
    setViewMode("upload");
    setSelectedImages([]);
    setOcrResults([]);
    setIsProcessing(false);
    
    // Clean up preview URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  };

  const renderUploadView = () => (
    <div className="text-center py-12">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
        <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Upload Passport Images
        </h3>
        <p className="text-gray-500 mb-6">
          Select passport images to extract text information
        </p>
        
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id="passport-upload"
        />
        
        <label
          htmlFor="passport-upload"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
        >
          <Upload className="w-5 h-5 mr-2" />
          Choose Passport Images
        </label>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Supported formats: JPG, PNG, WEBP</p>
          <p>Maximum file size: 10MB per image</p>
        </div>
      </div>
    </div>
  );

  const renderPreviewView = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Passport Images Preview
        </h3>
        <p className="text-gray-500">
          Review your passport images before processing
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedImages.map((file, index) => (
          <div key={index} className="border rounded-lg p-4">
            <img
              src={previewUrls[index]}
              alt={`Passport ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg mb-2"
            />
            <p className="text-sm text-gray-600 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center space-x-4">
        <button
          onClick={resetTool}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Choose Different Images
        </button>
        <button
          onClick={processOCR}
          disabled={isProcessing}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Extract Text
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderResultView = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Passport OCR Results
        </h3>
        <p className="text-gray-500">
          Extracted text from your passport images
        </p>
      </div>
      
      {ocrResults.map((result, index) => (
        <div key={index} className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-700">
              Passport {index + 1}
            </h4>
            <div className="flex items-center space-x-2">
              {result.confidence > 0 && (
                <span className="text-sm text-gray-500">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
              {result.text}
            </pre>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => copyToClipboard(result.text)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Text
            </button>
            <button
              onClick={() => downloadText(result.text, index)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>
        </div>
      ))}
      
      <div className="text-center">
        <button
          onClick={resetTool}
          className="flex items-center px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mx-auto"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Process New Passports
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Privacy Notice</p>
            <p>
              Your passport images are processed securely and are not stored on our servers. 
              All processing happens in real-time and your data remains private.
            </p>
          </div>
        </div>
      </div>
      
      {viewMode === "upload" && renderUploadView()}
      {viewMode === "preview" && renderPreviewView()}
      {viewMode === "result" && renderResultView()}
    </div>
  );
}