'use client'

import { useMemo, useCallback } from 'react'
import { VirtualizedAutocompleteSelect } from './VirtualizedAutocompleteSelect'
import { universityDataDetailed } from '@/data/universityDataDetailed'

export interface AcademicInfo {
  university: string
  faculty: string
  department: string
}

interface AcademicInfoSelectorProps {
  value: AcademicInfo
  onChange: (value: AcademicInfo) => void
  title?: {
    university?: string
    faculty?: string
    department?: string
  }
  description?: {
    university?: string
    faculty?: string
    department?: string
  }
  placeholder?: {
    university?: string
    faculty?: string
    department?: string
  }
  showSteps?: boolean
  currentStep?: 'university' | 'faculty' | 'department'
  className?: string
}

export function AcademicInfoSelector({
  value,
  onChange,
  title = {
    university: '大学を選択してください',
    faculty: '学部を選択してください',
    department: '学科を選択してください'
  },
  description = {
    university: '所属している大学を選んでください',
    faculty: '所属している学部を選んでください',
    department: '所属している学科を選んでください'
  },
  placeholder = {
    university: '大学名を入力してください',
    faculty: '学部名を入力してください',
    department: '学科名を入力してください'
  },
  showSteps = false,
  currentStep,
  className = ''
}: AcademicInfoSelectorProps) {

  // Get university options
  const universityOptions = useMemo(() => {
    console.log('University data:', universityDataDetailed.length, 'universities')
    return universityDataDetailed.map(u => ({
      value: u.name,
      label: u.name
    }))
  }, [])

  // Get faculty options based on selected university
  const facultyOptions = useMemo(() => {
    if (!value.university) return []
    const university = universityDataDetailed.find(u => u.name === value.university)
    return university?.faculties.map(f => ({
      value: f.name,
      label: f.name
    })) || []
  }, [value.university])

  // Get department options based on selected university and faculty
  const departmentOptions = useMemo(() => {
    if (!value.university || !value.faculty) return []
    const university = universityDataDetailed.find(u => u.name === value.university)
    if (!university) return []
    const faculty = university.faculties.find(f => f.name === value.faculty)
    return faculty?.departments.map(d => ({
      value: d.name,
      label: d.name
    })) || []
  }, [value.university, value.faculty])

  const handleUniversityChange = useCallback((newUniversity: string) => {
    onChange({
      university: newUniversity,
      faculty: '',
      department: ''
    })
  }, [onChange])

  const handleFacultyChange = useCallback((newFaculty: string) => {
    onChange({
      ...value,
      faculty: newFaculty,
      department: ''
    })
  }, [value, onChange])

  const handleDepartmentChange = useCallback((newDepartment: string) => {
    onChange({
      ...value,
      department: newDepartment
    })
  }, [value, onChange])

  const StepIndicator = ({ current, total }: { current: number, total: number }) => (
    <div className="flex justify-center mb-6">
      <div className="flex space-x-2">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i + 1 <= current ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )

  const renderUniversityStep = () => (
    <div className={`space-y-6 ${className}`}>
      {showSteps && <StepIndicator current={1} total={3} />}
      
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title.university}</h2>
        <p className="text-gray-600">{description.university}</p>
      </div>
      
      <VirtualizedAutocompleteSelect
        options={universityOptions}
        value={value.university}
        onChange={handleUniversityChange}
        placeholder={placeholder.university || '大学名を入力してください'}
      />
    </div>
  )

  const renderFacultyStep = () => (
    <div className={`space-y-6 ${className}`}>
      {showSteps && <StepIndicator current={2} total={3} />}
      
      <div className="text-center">
        {value.university && (
          <span className="text-sm text-indigo-600 font-medium">{value.university}</span>
        )}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title.faculty}</h2>
        <p className="text-gray-600">{description.faculty}</p>
      </div>
      
      <VirtualizedAutocompleteSelect
        options={facultyOptions}
        value={value.faculty}
        onChange={handleFacultyChange}
        placeholder={placeholder.faculty || '学部名を入力してください'}
        disabled={!value.university}
      />
    </div>
  )

  const renderDepartmentStep = () => (
    <div className={`space-y-6 ${className}`}>
      {showSteps && <StepIndicator current={3} total={3} />}
      
      <div className="text-center">
        {value.university && value.faculty && (
          <span className="text-sm text-indigo-600 font-medium">
            {value.university} • {value.faculty}
          </span>
        )}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title.department}</h2>
        <p className="text-gray-600">{description.department}</p>
      </div>
      
      <VirtualizedAutocompleteSelect
        options={departmentOptions}
        value={value.department}
        onChange={handleDepartmentChange}
        placeholder={placeholder.department || '学科名を入力してください'}
        disabled={!value.university || !value.faculty}
      />
    </div>
  )

  const renderAllSteps = () => (
    <div className={`space-y-8 ${className}`}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            大学 <span className="text-red-500">*</span>
          </label>
          <VirtualizedAutocompleteSelect
            options={universityOptions}
            value={value.university}
            onChange={handleUniversityChange}
            placeholder={placeholder.university || '大学名を入力してください'}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            学部 <span className="text-red-500">*</span>
          </label>
          <VirtualizedAutocompleteSelect
            options={facultyOptions}
            value={value.faculty}
            onChange={handleFacultyChange}
            placeholder={placeholder.faculty || '学部名を入力してください'}
            disabled={!value.university}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            学科 <span className="text-red-500">*</span>
          </label>
          <VirtualizedAutocompleteSelect
            options={departmentOptions}
            value={value.department}
            onChange={handleDepartmentChange}
            placeholder={placeholder.department || '学科名を入力してください'}
            disabled={!value.university || !value.faculty}
          />
        </div>
      </div>
    </div>
  )

  if (!currentStep) {
    return renderAllSteps()
  }

  switch (currentStep) {
    case 'university':
      return renderUniversityStep()
    case 'faculty':
      return renderFacultyStep()
    case 'department':
      return renderDepartmentStep()
    default:
      return renderAllSteps()
  }
}