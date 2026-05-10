'use client';

import { useState } from 'react';

interface LeadFormProps {
  onSubmit: (data: LeadFormData) => void;
  onSkip: () => void;
}

interface LeadFormData {
  name: string;
  phone: string;
  email?: string;
  budget?: string;
  location_preference?: string;
}

export default function LeadForm({ onSubmit, onSkip }: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    phone: '',
    email: '',
    budget: '',
    location_preference: '',
  });
  const [errors, setErrors] = useState<Partial<LeadFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Partial<LeadFormData> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^(\+254|0|254)\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Enter a valid Kenyan number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <div style={{
      background: 'rgba(20,184,166,0.05)',
      border: '1px solid rgba(20,184,166,0.2)',
      borderRadius: '16px',
      padding: '16px',
      marginTop: '8px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>
          🏠 Connect with an Agent
        </div>
        <div style={{ fontSize: '11px', color: '#9ca3af' }}>
          Fill in your details and we will call you shortly
        </div>
      </div>

      {/* Name */}
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Your full name *"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          style={{
            width: '100%',
            background: '#1f2937',
            border: `1px solid ${errors.name ? '#ef4444' : '#374151'}`,
            borderRadius: '8px',
            padding: '8px 12px',
            color: 'white',
            fontSize: '12px',
            outline: 'none',
          }}
        />
        {errors.name && (
          <div style={{ fontSize: '10px', color: '#ef4444', marginTop: '2px' }}>
            {errors.name}
          </div>
        )}
      </div>

      {/* Phone */}
      <div style={{ marginBottom: '10px' }}>
        <input
          type="tel"
          placeholder="Phone number e.g. 0712345678 *"
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          style={{
            width: '100%',
            background: '#1f2937',
            border: `1px solid ${errors.phone ? '#ef4444' : '#374151'}`,
            borderRadius: '8px',
            padding: '8px 12px',
            color: 'white',
            fontSize: '12px',
            outline: 'none',
          }}
        />
        {errors.phone && (
          <div style={{ fontSize: '10px', color: '#ef4444', marginTop: '2px' }}>
            {errors.phone}
          </div>
        )}
      </div>

      {/* Email */}
      <div style={{ marginBottom: '10px' }}>
        <input
          type="email"
          placeholder="Email address (optional)"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          style={{
            width: '100%',
            background: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            padding: '8px 12px',
            color: 'white',
            fontSize: '12px',
            outline: 'none',
          }}
        />
      </div>

      {/* Budget */}
      <div style={{ marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="Budget e.g. KSh 10M or KSh 50K/mo (optional)"
          value={formData.budget}
          onChange={e => setFormData({ ...formData, budget: e.target.value })}
          style={{
            width: '100%',
            background: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            padding: '8px 12px',
            color: 'white',
            fontSize: '12px',
            outline: 'none',
          }}
        />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            flex: 1,
            background: isSubmitting ? '#0d9488' : '#14b8a6',
            border: 'none',
            borderRadius: '8px',
            padding: '10px',
            color: 'white',
            fontSize: '12px',
            fontWeight: 600,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? 'Sending...' : 'Connect with Agent'}
        </button>
        <button
          onClick={onSkip}
          style={{
            background: 'none',
            border: '1px solid #374151',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#9ca3af',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
