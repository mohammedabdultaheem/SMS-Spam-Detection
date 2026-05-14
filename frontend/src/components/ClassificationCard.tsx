import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, Ban, ArrowRight } from 'lucide-react';

interface Props {
  data: {
    category: string;
    confidence: string;
    reason: string;
    suspicious_elements: string[];
    action: string;
  };
}

const ClassificationCard: React.FC<Props> = ({ data }) => {
  const getCategoryStyles = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('spam')) return { color: '#ef4444', icon: <Ban className="w-6 h-6" />, bg: 'rgba(239, 68, 68, 0.1)' };
    if (cat.includes('fraud') || cat.includes('scam')) return { color: '#f97316', icon: <AlertTriangle className="w-6 h-6" />, bg: 'rgba(249, 115, 22, 0.1)' };
    if (cat.includes('promotional')) return { color: '#3b82f6', icon: <Info className="w-6 h-6" />, bg: 'rgba(59, 130, 246, 0.1)' };
    return { color: '#22c55e', icon: <CheckCircle className="w-6 h-6" />, bg: 'rgba(34, 197, 94, 0.1)' };
  };

  const styles = getCategoryStyles(data.category);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass p-8 mt-8 w-full max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl" style={{ backgroundColor: styles.bg, color: styles.color }}>
            {styles.icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold">{data.category}</h3>
            <p className="text-text-secondary text-sm">Classification Result</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold gradient-text">{data.confidence}</div>
          <p className="text-text-secondary text-xs">Confidence Score</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-2">Reasoning</h4>
          <p className="text-lg leading-relaxed">{data.reason}</p>
        </div>

        {data.suspicious_elements.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-2">Suspicious Elements</h4>
            <div className="flex flex-wrap gap-2">
              {data.suspicious_elements.map((el, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm">
                  {el}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 font-semibold" style={{ color: styles.color }}>
            <ArrowRight className="w-5 h-5" />
            <span>Recommended Action: {data.action}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClassificationCard;
