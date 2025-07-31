"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, Upload, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"

export default function EcoRestorationModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [formData, setFormData] = useState({
    // Step 1
    degradedLandType: "",
    state: "JHARKHAND",
    district: "",
    division: "Giridih East",
    range: "",
    totalLandArea: "",
    treeCanopyDensity: "",
    beat: "",
    compartmentNo: "",
    surveyNo: "",
    // Step 2
    edaphicDetails: "",
    slopeAndTerrain: "",
    geologicalFeatures: "",
    // Step 3
    kmlFile: null,
    geoTaggedImages: [],
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  
  const validateField = (field, value) => {
    const newErrors = { ...errors }
    
    switch (field) {
      case 'degradedLandType':
        if (!value || value.trim() === '') {
          newErrors[field] = 'Please select a degraded land type'
        } else {
          delete newErrors[field]
        }
        break
        
      case 'district':
        if (!value || value.trim() === '') {
          newErrors[field] = 'Please select a district'
        } else {
          delete newErrors[field]
        }
        break
        
      case 'range':
        if (!value || value.trim() === '') {
          newErrors[field] = 'Range is required'
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          newErrors[field] = 'Range must be a positive number'
        } else {
          delete newErrors[field]
        }
        break
        
      case 'totalLandArea':
        if (!value || value.trim() === '') {
          newErrors[field] = 'Total land area is required'
        } else if (isNaN(value) || parseFloat(value) < 5) {
          newErrors[field] = 'Total land area must be at least 5 hectares'
        } else {
          delete newErrors[field]
        }
        break
        
      case 'treeCanopyDensity':
        if (value === '' || value === null || value === undefined) {
          newErrors[field] = 'Tree canopy density is required'
        } else if (isNaN(value) || parseFloat(value) < 0 || parseFloat(value) > 0.4) {
          newErrors[field] = 'Tree canopy density must be between 0 and 0.4'
        } else {
          delete newErrors[field]
        }
        break
        
      case 'beat':
        if (!value || value.trim() === '') {
          newErrors[field] = 'Beat is required'
        } else if (value.trim().length < 2) {
          newErrors[field] = 'Beat must be at least 2 characters'
        } else {
          delete newErrors[field]
        }
        break
        
      case 'compartmentNo':
        if (!value || value.trim() === '') {
          newErrors[field] = 'Compartment number is required'
        } else if (value.trim().length < 2) {
          newErrors[field] = 'Compartment number must be at least 2 characters'
        } else {
          delete newErrors[field]
        }
        break
        
      case 'surveyNo':
        if (!value || value.trim() === '') {
          newErrors[field] = 'Survey number is required'
        } else if (value.trim().length < 2) {
          newErrors[field] = 'Survey number must be at least 2 characters'
        } else {
          delete newErrors[field]
        }
        break
        
      case 'edaphicDetails':
        if (!value || value.trim() === '') {
          newErrors[field] = 'Edaphic details are required'
        } else if (value.trim().length < 50) {
          newErrors[field] = 'Edaphic details must be at least 50 characters'
        } else if (value.length > 500) {
          newErrors[field] = 'Edaphic details cannot exceed 500 characters'
        } else {
          delete newErrors[field]
        }
        break
        
      case 'slopeAndTerrain':
        if (!value || value.trim() === '') {
          newErrors[field] = 'Slope and terrain details are required'
        } else if (value.trim().length < 50) {
          newErrors[field] = 'Slope and terrain details must be at least 50 characters'
        } else if (value.length > 500) {
          newErrors[field] = 'Slope and terrain details cannot exceed 500 characters'
        } else {
          delete newErrors[field]
        }
        break
        
      case 'geologicalFeatures':
        if (!value || value.trim() === '') {
          newErrors[field] = 'Geological features are required'
        } else if (value.trim().length < 50) {
          newErrors[field] = 'Geological features must be at least 50 characters'
        } else if (value.length > 500) {
          newErrors[field] = 'Geological features cannot exceed 500 characters'
        } else {
          delete newErrors[field]
        }
        break
        
      case 'kmlFile':
        if (!value) {
          newErrors[field] = 'GPS boundary image is required'
        } else {
          const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
          if (!allowedTypes.includes(value.type)) {
            newErrors[field] = 'File must be JPEG, PNG, WebP, or JPG format'
          } else if (value.size > 10 * 1024 * 1024) { // 10MB
            newErrors[field] = 'File size must be less than 10MB'
          } else {
            delete newErrors[field]
          }
        }
        break
        
      case 'geoTaggedImages':
        if (!value || value.length === 0) {
          newErrors[field] = 'Geo-tagged images are required'
        } else if (value.length < 2) {
          newErrors[field] = 'At least 2 geo-tagged images are required'
        } else {
          const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
          const invalidFiles = value.filter(file => 
            !allowedTypes.includes(file.type) || file.size > 10 * 1024 * 1024
          )
          if (invalidFiles.length > 0) {
            newErrors[field] = 'All files must be JPEG, PNG, WebP, or JPG format and less than 10MB'
          } else {
            delete newErrors[field]
          }
        }
        break
        
      default:
        break
    }
    
    setErrors(newErrors)
    return !newErrors[field]
  }

  const checkStepValidity = (step) => {
    const fieldsToValidate = {
      1: ['degradedLandType', 'district', 'totalLandArea', 'range', 'treeCanopyDensity', 'beat', 'compartmentNo', 'surveyNo'],
      2: ['edaphicDetails', 'slopeAndTerrain', 'geologicalFeatures'],
      3: ['kmlFile', 'geoTaggedImages']
    }
    
    const fields = fieldsToValidate[step] || []
    
    return fields.every(field => {
      const fieldValue = formData[field]
      // Check validation without updating state
      return isFieldValid(field, fieldValue)
    })
  }

  const isFieldValid = (field, value) => {
    switch (field) {
      case 'degradedLandType':
        return value && value.trim() !== ''
      case 'district':
        return value && value.trim() !== ''
      case 'range':
        return value && value.trim() !== '' && !isNaN(value) && parseFloat(value) > 0
      case 'totalLandArea':
        return value && value.trim() !== '' && !isNaN(value) && parseFloat(value) >= 5
      case 'treeCanopyDensity':
        return value !== '' && value !== null && value !== undefined && !isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 0.4
      case 'beat':
        return value && value.trim() !== '' && value.trim().length >= 2
      case 'compartmentNo':
        return value && value.trim() !== '' && value.trim().length >= 2
      case 'surveyNo':
        return value && value.trim() !== '' && value.trim().length >= 2
      case 'edaphicDetails':
        return value && value.trim() !== '' && value.trim().length >= 50 && value.length <= 500
      case 'slopeAndTerrain':
        return value && value.trim() !== '' && value.trim().length >= 50 && value.length <= 500
      case 'geologicalFeatures':
        return value && value.trim() !== '' && value.trim().length >= 50 && value.length <= 500
      case 'kmlFile':
        if (!value) return false
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
        return allowedTypes.includes(value.type) && value.size <= 10 * 1024 * 1024
      case 'geoTaggedImages':
        if (!value || value.length < 2) return false
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
        return value.every(file => allowedImageTypes.includes(file.type) && file.size <= 10 * 1024 * 1024)
      default:
        return true
    }
  }

  const validateStep = (step) => {
    const fieldsToValidate = {
      1: ['degradedLandType', 'district', 'totalLandArea', 'range', 'treeCanopyDensity', 'beat', 'compartmentNo', 'surveyNo'],
      2: ['edaphicDetails', 'slopeAndTerrain', 'geologicalFeatures'],
      3: ['kmlFile', 'geoTaggedImages']
    }
    
    const fields = fieldsToValidate[step] || []
    let isValid = true
    
    fields.forEach(field => {
      const fieldValue = formData[field]
      const fieldValid = validateField(field, fieldValue)
      if (!fieldValid) {
        isValid = false
      }
      setTouched(prev => ({ ...prev, [field]: true }))
    })
    
    return isValid
  }

  const handleNext = () => {
    if (currentStep < totalSteps && validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      validateField(field, value)
    }
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    validateField(field, formData[field])
  }

  const handleFileUpload = (field, files) => {
    if (files) {
      if (field === 'geoTaggedImages') {
        const filesArray = Array.from(files)
        setFormData((prev) => ({ ...prev, [field]: filesArray }))
        if (touched[field]) {
          validateField(field, filesArray)
        }
      } else {
        setFormData((prev) => ({ ...prev, [field]: files[0] }))
        if (touched[field]) {
          validateField(field, files[0])
        }
      }
    }
  }

  const ErrorMessage = ({ error }) => (
    error ? (
      <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
        <AlertCircle className="h-3 w-3" />
        <span>{error}</span>
      </div>
    ) : null
  )

  const getFieldClasses = (field) => {
    const hasError = errors[field] && touched[field]
    return hasError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="degradedLandType">
            Select the type of Degraded Land <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.degradedLandType}
            onValueChange={(value) => handleInputChange("degradedLandType", value)}
          >
            <SelectTrigger className={getFieldClasses('degradedLandType')}>
              <SelectValue placeholder="Select degraded land type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="degraded-forest">Degraded Forest Land</SelectItem>
              <SelectItem value="degraded-grassland">Degraded Grassland</SelectItem>
              <SelectItem value="mining-area">Mining Area</SelectItem>
              <SelectItem value="wasteland">Wasteland</SelectItem>
            </SelectContent>
          </Select>
          <ErrorMessage error={errors.degradedLandType} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            className="bg-gray-50"
            readOnly
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">
            District <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.district} 
            onValueChange={(value) => handleInputChange("district", value)}
          >
            <SelectTrigger className={getFieldClasses('district')}>
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="giridih">Giridih</SelectItem>
              <SelectItem value="dhanbad">Dhanbad</SelectItem>
              <SelectItem value="bokaro">Bokaro</SelectItem>
            </SelectContent>
          </Select>
          <ErrorMessage error={errors.district} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="division">Division</Label>
          <Input
            id="division"
            value={formData.division}
            onChange={(e) => handleInputChange("division", e.target.value)}
            className="bg-gray-50"
            readOnly
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalLandArea">
            Total Land Area <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            id="totalLandArea"
            placeholder="Enter the Total Land Area Size (in Hectares)"
            value={formData.totalLandArea}
            onChange={(e) => handleInputChange("totalLandArea", e.target.value)}
            onBlur={() => handleBlur("totalLandArea")}
            className={getFieldClasses('totalLandArea')}
          />
          <p className="text-xs text-gray-500">(Not less than 5 hectares)</p>
          <ErrorMessage error={errors.totalLandArea} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="range">
            Range <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            id="range"
            placeholder="Enter your Range"
            value={formData.range}
            onChange={(e) => handleInputChange("range", e.target.value)}
            onBlur={() => handleBlur("range")}
            className={getFieldClasses('range')}
          />
          <ErrorMessage error={errors.range} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="treeCanopyDensity">
            Tree Canopy Density <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            min={0}
            max={0.4}
            step={0.01}
            id="treeCanopyDensity"
            placeholder="Enter your Tree Canopy Density"
            value={formData.treeCanopyDensity ?? ""}
            onChange={(e) => handleInputChange("treeCanopyDensity", parseFloat(e.target.value) || 0)}
            onBlur={() => handleBlur("treeCanopyDensity")}
            className={getFieldClasses('treeCanopyDensity')}
          />
          <p className="text-xs text-gray-500">(in percentage between 0 - 0.4)</p>
          <ErrorMessage error={errors.treeCanopyDensity} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="compartmentNo">Compartment No <span className="text-red-500">*</span></Label>
          <Input
          type="number"
            id="compartmentNo"
            placeholder="Enter your Compartment No"
            value={formData.compartmentNo}
            onChange={(e) => handleInputChange("compartmentNo", e.target.value)}
            onBlur={() => handleBlur("compartmentNo")}
            className={getFieldClasses('compartmentNo')}
          />
          <ErrorMessage error={errors.compartmentNo} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="beat">Beat <span className="text-red-500">*</span></Label>
          <Input
            id="beat"
            placeholder="Enter your Beat"
            value={formData.beat}
            onChange={(e) => handleInputChange("beat", e.target.value)}
            onBlur={() => handleBlur("beat")}
            className={getFieldClasses('beat')}
          />
          <ErrorMessage error={errors.beat} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="surveyNo">Survey No <span className="text-red-500">*</span></Label>
          <Input
          type="number"
            id="surveyNo"
            placeholder="Enter your Survey No"
            value={formData.surveyNo}
            onChange={(e) => handleInputChange("surveyNo", e.target.value)}
            onBlur={() => handleBlur("surveyNo")}
            className={getFieldClasses('surveyNo')}
          />
          <ErrorMessage error={errors.surveyNo} />
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 mb-4">Enter Plot/ Site/ Area Type Details</div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="edaphicDetails">
            Edaphic Details <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="edaphicDetails"
            placeholder="(in 500 characters)"
            value={formData.edaphicDetails}
            onChange={(e) => handleInputChange("edaphicDetails", e.target.value)}
            onBlur={() => handleBlur("edaphicDetails")}
            className={`min-h-[120px] ${getFieldClasses('edaphicDetails')}`}
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <ErrorMessage error={errors.edaphicDetails} />
            <span className="text-xs text-gray-500">{formData.edaphicDetails.length}/500</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="slopeAndTerrain">
            Slope And Terrain <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="slopeAndTerrain"
            placeholder="(in 500 characters)"
            value={formData.slopeAndTerrain}
            onChange={(e) => handleInputChange("slopeAndTerrain", e.target.value)}
            onBlur={() => handleBlur("slopeAndTerrain")}
            className={`min-h-[120px] ${getFieldClasses('slopeAndTerrain')}`}
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <ErrorMessage error={errors.slopeAndTerrain} />
            <span className="text-xs text-gray-500">{formData.slopeAndTerrain.length}/500</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="geologicalFeatures">
            Geological Features <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="geologicalFeatures"
            placeholder="(in 500 characters)"
            value={formData.geologicalFeatures}
            onChange={(e) => handleInputChange("geologicalFeatures", e.target.value)}
            onBlur={() => handleBlur("geologicalFeatures")}
            className={`min-h-[120px] ${getFieldClasses('geologicalFeatures')}`}
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <ErrorMessage error={errors.geologicalFeatures} />
            <span className="text-xs text-gray-500">{formData.geologicalFeatures.length}/500</span>
          </div>
        </div>
      </div>
    </div>
  )

 const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 mb-4">Please upload the following</div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label>
            Please upload GPS Boundary (KML file) of land parcel <span className="text-red-500">*</span>
          </Label>
          <Card className={`border-2 border-dashed hover:border-gray-400 transition-colors ${errors.kmlFile && touched.kmlFile ? 'border-red-500' : 'border-gray-300'}`}>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  Please ensure that the KML file should contain closed polygon of land parcel and area of polygon in
                  KML file should not be less than the area filled in the form
                </div>
                <div className="text-lg font-medium text-gray-700">Drag Drop your file here</div>
                <div className="relative">
                  <input
                    type="file"
                    accept="text/kml"
                    onChange={(e) => handleFileUpload('kmlFile', e.target.files)}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    id="boundary-upload"
                  />
                  <Button 
                    variant="outline" 
                    className="border-green-500 text-green-600 hover:bg-green-50 bg-transparent relative"
                    onClick={() => document.getElementById('boundary-upload').click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload KML File
                  </Button>
                </div>
               
                {formData.kmlFile && (
                  <p className="text-sm text-green-600">✓ {formData.kmlFile.name}</p>
                )}
              </div>
            </CardContent>
          </Card>
          <ErrorMessage error={errors.kmlFile} />
        </div>

        <div className="space-y-4">
          <Label>
            Upload GeoTagged Images  <span className="text-red-500">*</span>
          </Label>
          <Card className={`border-2 border-dashed hover:border-gray-400 transition-colors ${errors.geoTaggedImages && touched.geoTaggedImages ? 'border-red-500' : 'border-gray-300'}`}>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="text-lg font-medium text-gray-700">Drag Drop your files here</div>
                <div className="text-sm text-gray-500">Supported formats: .jpeg, .png, .webp, .jpg | Size: Up to 10MB each</div>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={(e) => handleFileUpload('geoTaggedImages', e.target.files)}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    id="images-upload"
                  />
                  <Button 
                    variant="outline" 
                    className="border-green-500 text-green-600 hover:bg-green-50 bg-transparent relative"
                    onClick={() => document.getElementById('images-upload').click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Images
                  </Button>
                </div>
                {formData.geoTaggedImages && formData.geoTaggedImages.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-green-600">
                      ✓ {formData.geoTaggedImages.length} file(s) selected
                    
                    </p>
                    <div className="text-xs text-gray-500 max-h-20 overflow-y-auto">
                      {formData.geoTaggedImages.map((file, index) => (
                        <div key={index} className="flex items-center justify-between py-1">
                          <span>• {file.name}</span>
                          <span className="text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(1)}MB
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <ErrorMessage error={errors.geoTaggedImages} />
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Registration Complete!</h3>
        <p className="text-gray-600">
          Your eco-restoration block registration has been submitted successfully. You will receive a confirmation email
          shortly.
        </p>
        <div className="text-sm text-gray-500 mt-4">
          <p>Submitted files:</p>
          <ul className="mt-2 space-y-1">
            <li>• GPS Boundary: {formData.kmlFile?.name}</li>
            <li>• Geo-tagged Images: {formData.geoTaggedImages?.length} files</li>
          </ul>
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full sm:max-w-[925px] sm:max-h-[625px] overflow-y-auto bg-[#e5f2f8] ">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">Register Eco-Restoration blocks</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              {currentStep} of {totalSteps}
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <Progress value={progress} className="w-full" />

          <div className="min-h-[400px]">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {currentStep < totalSteps ? (
              <Button 
                onClick={handleNext} 
                className="bg-green-600 hover:bg-green-700"
                disabled={!checkStepValidity(currentStep)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
                Close
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}