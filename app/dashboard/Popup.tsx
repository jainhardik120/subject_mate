import React, { useState, useEffect } from 'react';
import useSigner from '../state';

type Category = {
  id: number;
  category_name: string;
};

type Subject = {
  id: number;
  subject_name: string;
};

type PopupProps = {
  onClose: () => void;
};

const Popup: React.FC<PopupProps> = ({ onClose }) => {
  const { token, setToken } = useSigner();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [preferences, setPreferences] = useState<number[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/subjects/categories', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [token]);

  const fetchSubjects = async (categoryId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/subjects/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setSubjects(data.subjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    fetchSubjects(categoryId);
  };

  const handleCheckboxChange = (subjectId: number) => {
    if (preferences.includes(subjectId)) {
      // Remove subject from preferences if already selected
      setPreferences(prev => prev.filter(id => id !== subjectId));
    } else {
      // Add subject to preferences with the next available number
      setPreferences(prev => [...prev, subjectId]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requestBody = {
      category_id: selectedCategory,
      subject_id: selectedSubject,
      preferences: preferences.map((subjectId) => ({
        subject_id: subjectId
      }))
    };
    const response = await fetch('/api/request/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error('Failed to create request');
    }

    setSelectedCategory("");
    setSelectedSubject(null);
    setPreferences([]);
    onClose();
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Create New Request
                  </h3>
                  <div className="mt-2">
                    <div className="mb-4">
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">Select Category</label>
                      <select id="category" name="category" value={selectedCategory} onChange={handleCategoryChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="">Select</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id.toString()}>{category.category_name}</option>
                        ))}
                      </select>
                    </div>
                    {subjects.length > 0 && (
                      <div className="mb-4">
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Select Subject</label>
                        <select id="subject" name="subject" value={selectedSubject ?? ''} onChange={e => setSelectedSubject(Number(e.target.value))} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          <option value="">Select</option>
                          {subjects.map(subject => (
                            <option key={subject.id} value={subject.id}>
                              {subject.subject_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {selectedSubject && (
                      <fieldset className="mb-4">
                        <legend className="block text-sm font-medium text-gray-700">Select Preferences</legend>
                        {subjects.filter(subject => subject.id !== selectedSubject).map(subject => (
                          <div key={subject.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`subject-${subject.id}`}
                              checked={preferences.includes(subject.id)}
                              onChange={() => handleCheckboxChange(subject.id)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`subject-${subject.id}`} className="ml-2">
                              {subject.subject_name}
                            </label>
                            {preferences.includes(subject.id) && (
                              <span className="ml-auto">Preference {preferences.indexOf(subject.id) + 1}</span>
                            )}
                          </div>
                        ))}
                      </fieldset>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                Save
              </button>
              <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Popup;
