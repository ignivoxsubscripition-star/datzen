import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { calculatePasswordStrength } from '@/lib/utils/passwordStrength';
import { passwordPatterns } from '@/lib/validations/auth';
import { cn } from '@/lib/utils'; // Assuming cn exists, if not I'll check or use template literals

interface PasswordStrengthUIProps {
  password: string;
  isFocused: boolean;
}

export const PasswordStrengthUI: React.FC<PasswordStrengthUIProps> = ({ password, isFocused }) => {
  const strength = calculatePasswordStrength(password);
  
  const requirements = [
    { label: 'At least 8 characters', met: passwordPatterns.minLength.test(password) },
    { label: 'One uppercase letter', met: passwordPatterns.uppercase.test(password) },
    { label: 'One lowercase letter', met: passwordPatterns.lowercase.test(password) },
    { label: 'One number', met: passwordPatterns.number.test(password) },
    { label: 'One special character', met: passwordPatterns.special.test(password) },
  ];

  return (
    <AnimatePresence>
      {(isFocused || password.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-3 p-4 bg-white rounded-xl border border-slate-200 shadow-xl z-20 relative"
        >
          {/* Strength Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password Strength</span>
              <span className={`text-xs font-bold ${strength.score <= 2 ? 'text-red-500' : strength.score <= 4 ? 'text-yellow-600' : 'text-green-600'}`}>
                {strength.label}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`h-full flex-1 transition-all duration-500 rounded-full ${
                    step <= strength.score ? strength.color : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Requirements List */}
          <div className="space-y-2">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`shrink-0 h-4 w-4 rounded-full flex items-center justify-center ${req.met ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                  {req.met ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                </div>
                <span className={`text-xs ${req.met ? 'text-green-700 font-medium' : 'text-slate-500'}`}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
