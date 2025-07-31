"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, Plus, Trash2, User, Mail, Phone, MapPin, Users, GraduationCap, AlertCircle, Edit, CheckCircle, XCircle } from "lucide-react"

// Custom Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-blue-500" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg max-w-sm ${getBgColor()}`}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <p className="font-medium text-gray-900">{message.title}</p>
          {message.description && (
            <p className="text-sm text-gray-600 mt-1">{message.description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XCircle className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-0 right-0 z-50 p-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default function StudentManagement() {
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    email: "",
    address: "",
    phoneNumber: "",
    fatherName: "",
    motherName: "",
  })

  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [toasts, setToasts] = useState([])

  // Toast helper functions
  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showSuccess = (title, description) => {
    addToast({ title, description }, 'success')
  }

  const showError = (title, description) => {
    addToast({ title, description }, 'error')
  }

  const fetchStudents = async () => {
    try {
      setIsLoading(true)
      const res = await axios.get("http://localhost:3001/students")
      setStudents(res.data)
    } catch (error) {
      showError("Failed to fetch students", "Please check your connection and try again")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateAllFields()) {
      showError("Please fix all validation errors", "Check the highlighted fields and try again")
      return
    }

    // Check for duplicate roll number
    const existingStudent = students.find(
      (student) =>
        student &&
        student.rollNo &&
        typeof student.rollNo === "string" &&
        student.rollNo.toLowerCase() === formData.rollNo.toLowerCase()
    )

    if (existingStudent) {
      setFieldErrors({ ...fieldErrors, rollNo: "Roll number already exists" })
      showError("Duplicate roll number", "This roll number is already registered")
      return
    }

    try {
      setIsSubmitting(true)
      
      // Prepare clean data for submission
      const submitPayload = {
        name: formData.name.trim(),
        rollNo: formData.rollNo.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        fatherName: formData.fatherName.trim(),
        motherName: formData.motherName.trim(),
      }

      const response = await axios.post("http://localhost:3001/students", submitPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('Create response:', response.data)

      // Store the name before resetting form
      const studentName = formData.name

      // Reset form
      setFormData({
        name: "",
        rollNo: "",
        email: "",
        address: "",
        phoneNumber: "",
        fatherName: "",
        motherName: "",
      })
      setFieldErrors({})

      await fetchStudents()
      
      showSuccess("Student added successfully", `${studentName} has been registered`)
    } catch (error) {
      console.error('Create error:', error)
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Please check your connection and try again"
      showError("Failed to add student", errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id, name) => {
    try {
      await axios.delete(`http://localhost:3001/students/${id}`)
      await fetchStudents()
      showSuccess(`${name} has been removed`, "The student record has been successfully deleted")
    } catch (error) {
      showError("Failed to delete student", "Please try again later")
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  const formFields = [
    { key: "name", label: "Full Name", icon: User, placeholder: "Enter student's full name" },
    { key: "rollNo", label: "Roll Number", icon: GraduationCap, placeholder: "Enter roll number" },
    { key: "email", label: "Email Address", icon: Mail, placeholder: "Enter email address", type: "email" },
    { key: "phoneNumber", label: "Phone Number", icon: Phone, placeholder: "Enter phone number", type: "tel" },
    { key: "fatherName", label: "Father's Name", icon: User, placeholder: "Enter father's name" },
    { key: "motherName", label: "Mother's Name", icon: User, placeholder: "Enter mother's name" },
  ]

  const validateField = (key, value) => {
    let error = ""
    switch (key) {
      case "name":
        if (!value) error = "Name is required"
        break
      case "rollNo":
        if (!value) error = "Roll number is required"
        break
      case "email":
        if (!value) error = "Email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email format"
        break
      case "phoneNumber":
        if (!value) error = "Phone number is required"
        break
      case "address":
        if (!value) error = "Address is required"
        break
      case "fatherName":
        if (!value) error = "Father's name is required"
        break
      case "motherName":
        if (!value) error = "Mother's name is required"
        break
      default:
        break
    }
    return error
  }

  const validateAllFields = () => {
    const errors = {}
    formFields.forEach(({ key }) => {
      const error = validateField(key, formData[key])
      if (error) {
        errors[key] = error
      }
    })
    if (formData.address === "") {
      errors["address"] = "Address is required"
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value })
    setFieldErrors({ ...fieldErrors, [key]: validateField(key, value) })
  }

  const handleInputBlur = (key, value) => {
    setFieldErrors({ ...fieldErrors, [key]: validateField(key, value) })
  }

  const safeDisplayText = (text, defaultText) => {
    return text || defaultText
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!validateAllFields()) {
      showError("Please fix all validation errors", "Check the highlighted fields and try again")
      return
    }

    // Check for duplicate roll number (excluding current student)
    const existingStudent = students.find(
      (student) =>
        student &&
        student.rollNo &&
        typeof student.rollNo === "string" &&
        student.rollNo.toLowerCase() === formData.rollNo.toLowerCase() &&
        student.id !== editingStudent.id,
    )

    if (existingStudent) {
      setFieldErrors({ ...fieldErrors, rollNo: "Roll number already exists" })
      showError("Duplicate roll number", "This roll number is already registered")
      return
    }

    try {
      setIsUpdating(true)
      
      // Make sure we're sending the correct data format
      const updatePayload = {
        name: formData.name.trim(),
        rollNo: formData.rollNo.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        fatherName: formData.fatherName.trim(),
        motherName: formData.motherName.trim(),
      }

      console.log('Updating student with ID:', editingStudent.id)
      console.log('Update payload:', updatePayload)

      const response = await axios.patch(
        `http://localhost:3001/students/${editingStudent.id}`, 
        updatePayload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      console.log('Update response:', response.data)

      await fetchStudents()

      showSuccess("Student updated successfully!", `${formData.name}'s record has been updated`)

      // Reset form and close dialog
      resetForm()
      setIsEditDialogOpen(false)
      setEditingStudent(null)
    } catch (error) {
      console.error('Update error:', error)
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Please try again"
      showError("Failed to update student", errorMessage)
    } finally {
      setIsUpdating(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      rollNo: "",
      email: "",
      address: "",
      phoneNumber: "",
      fatherName: "",
      motherName: "",
    })
    setFieldErrors({})
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setFormData({
      name: student.name || "",
      rollNo: student.rollNo || "",
      email: student.email || "",
      address: student.address || "",
      phoneNumber: student.phoneNumber || "",
      fatherName: student.fatherName || "",
      motherName: student.motherName || "",
    })
    setFieldErrors({})
    setIsEditDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Student Management System
          </h1>
          <p className="text-gray-600 text-lg">Manage student records with ease and efficiency</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Add Student Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Student
                </CardTitle>
                <CardDescription className="text-blue-100">Fill in the student details below</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {formFields.map(({ key, label, icon: Icon, placeholder, type = "text" }) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * formFields.indexOf(formFields.find((f) => f.key === key)) }}
                        className="space-y-2"
                      >
                        <Label htmlFor={key} className="flex items-center gap-2 text-sm font-medium">
                          <Icon className="h-4 w-4 text-gray-500" />
                          {label}
                        </Label>
                        <Input
                          id={key}
                          type={type}
                          placeholder={placeholder}
                          value={formData[key]}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          onBlur={(e) => handleInputBlur(key, e.target.value)}
                          className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                            fieldErrors[key] ? "border-red-500 focus:ring-red-500" : ""
                          }`}
                        />
                        {fieldErrors[key] && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-1 text-red-500 text-xs"
                          >
                            <AlertCircle className="h-3 w-3" />
                            {fieldErrors[key]}
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      Address
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Enter complete address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      onBlur={(e) => handleInputBlur("address", e.target.value)}
                      className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                        fieldErrors.address ? "border-red-500 focus:ring-red-500" : ""
                      }`}
                      rows={3}
                    />
                    {fieldErrors.address && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-red-500 text-xs"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {fieldErrors.address}
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding Student...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Student
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Statistics Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm h-fit">
              <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                    className="text-4xl font-bold text-gray-800 mb-2"
                  >
                    {students.length}
                  </motion.div>
                  <p className="text-gray-600">Total Students Registered</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Students List */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Student Records ({students.length})
              </CardTitle>
              <CardDescription className="text-indigo-100">Manage and view all registered students</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading students...</span>
                </div>
              ) : students.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No students registered yet</p>
                  <p className="text-gray-400">Add your first student using the form above</p>
                </motion.div>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-6">
                  <AnimatePresence>
                    {students.map((student, index) => (
                      <motion.div
                        key={student.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: -100 }}
                        layout
                        className="group"
                      >
                        <Card className="border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                    {student.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-semibold text-gray-800">{student.name}</h3>
                                    <Badge variant="secondary" className="mt-1">
                                      Roll No: {student.rollNo}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="h-4 w-4" />
                                    {student.email}
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Phone className="h-4 w-4" />
                                    {student.phoneNumber}
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="h-4 w-4" />
                                    {student.address}
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Users className="h-4 w-4" />
                                    Parents: {student.fatherName}, {student.motherName}
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                {/* Edit Button */}
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(student)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 border-blue-300 text-blue-600 hover:bg-blue-50"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </motion.div>

                                {/* Delete Button */}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </motion.div>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Student Record</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete {safeDisplayText(student.name, "this student")}
                                        's record? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(student.id, student.name)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Student Dialog */}
        <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-xl">
                <Edit className="h-5 w-5 text-blue-600" />
                Edit Student Record
              </AlertDialogTitle>
              <AlertDialogDescription>
                Update the student information below. All fields are required.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <form onSubmit={handleUpdate} className="space-y-6 py-4">
              <div className="grid md:grid-cols-2 gap-4">
                {formFields.map(({ key, label, icon: Icon, placeholder, type = "text" }, index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="space-y-2"
                  >
                    <Label htmlFor={`edit-${key}`} className="flex items-center gap-2 text-sm font-medium">
                      <Icon className="h-4 w-4 text-gray-500" />
                      {label}
                    </Label>
                    <Input
                      id={`edit-${key}`}
                      type={type}
                      placeholder={placeholder}
                      value={formData[key]}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      onBlur={(e) => handleInputBlur(key, e.target.value)}
                      className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                        fieldErrors[key] ? "border-red-500 focus:ring-red-500" : ""
                      }`}
                    />
                    {fieldErrors[key] && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-red-500 text-xs"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {fieldErrors[key]}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="edit-address" className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  Address
                </Label>
                <Textarea
                  id="edit-address"
                  placeholder="Enter complete address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  onBlur={(e) => handleInputBlur("address", e.target.value)}
                  className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.address ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  rows={3}
                />
                {fieldErrors.address && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-red-500 text-xs"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.address}
                  </motion.div>
                )}
              </motion.div>
            </form>

            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel
                onClick={() => {
                  setIsEditDialogOpen(false)
                  setEditingStudent(null)
                  resetForm()
                }}
              >
                Cancel
              </AlertDialogCancel>
              <Button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Update Student
                  </>
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}