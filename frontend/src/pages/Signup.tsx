import { SignUp } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

export default function Signup() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SignUp
          routing="path"
          path="/signup"
          signInUrl="/login"
          fallbackRedirectUrl="/dashboard"
        />
      </motion.div>
    </div>
  );
}
