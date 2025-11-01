import React from 'react';
import { motion } from 'framer-motion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

export interface TabItem {
  key: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsContainerProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
  variant?: 'default' | 'pills' | 'underline' | 'modern';
  orientation?: 'horizontal' | 'vertical';
  onChange?: (value: string) => void;
}

export function TabsContainer({
  tabs,
  defaultTab,
  className = '',
  variant = 'modern',
  orientation = 'horizontal',
  onChange,
}: TabsContainerProps) {
  const defaultValue = defaultTab || tabs[0]?.key;
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onChange?.(value);
  };

  // Framer Motion variants
  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <Tabs
      defaultValue={defaultValue}
      value={activeTab}
      onValueChange={handleTabChange}
      className={cn(
        'w-full',
        orientation === 'vertical' ? 'flex gap-6' : 'block',
        className
      )}
    >
      {/* TabsList wrapper for scroll handling */}
      <div className={cn(
        'relative',
        orientation === 'vertical' 
          ? 'w-1/4 min-w-[200px]' 
          : 'w-full overflow-x-auto pb-2 mb-2'
      )}>
        <TabsList 
          className={cn(
            'w-full',
            // Horizontal scroll on mobile for horizontal tabs
            orientation === 'horizontal' && 'flex min-w-max',
            // Vertical styling
            orientation === 'vertical' && 'flex-col h-auto space-y-1',
            // Variant styling
            variant === 'modern' && 'bg-background border rounded-xl p-1 gap-1',
            variant === 'pills' && 'bg-transparent p-1 gap-2',
            variant === 'underline' && 'bg-transparent border-b rounded-none p-0 gap-4'
          )}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              disabled={tab.disabled}
              className={cn(
                'relative flex-1 min-w-[120px] whitespace-nowrap px-3 py-1.5',
                'text-sm font-medium transition-all',
                'data-[state=active]:text-primary-foreground',
                // Variant-specific styles
                variant === 'modern' && 'data-[state=active]:bg-primary data-[state=active]:shadow-sm rounded-lg',
                variant === 'pills' && 'rounded-full data-[state=active]:bg-primary',
                variant === 'underline' && 'rounded-none border-b-2 border-transparent data-[state=active]:border-primary',
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <motion.div
                className="flex items-center justify-center gap-2"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1 }
                }}
                transition={{ duration: 0.2 }}
              >
                {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.icon ? tab.label.charAt(0) : tab.label}</span>
              </motion.div>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Content area */}
      <div className={cn(
        'relative',
        orientation === 'vertical' ? 'flex-1' : 'w-full'
      )}>
        {tabs.map((tab) => (
          <TabsContent
            key={tab.key}
            value={tab.key}
            className={cn(
              'mt-0',
              orientation === 'vertical' ? 'flex-1' : '',
              activeTab === tab.key ? 'block' : 'hidden'
            )}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabVariants}
              transition={{ duration: 0.3 }}
            >
              {tab.content}
            </motion.div>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}