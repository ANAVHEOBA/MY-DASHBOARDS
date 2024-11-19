import { Card } from '../ui/card';

interface AnalyticsCardProps {
  title: string;
  metrics: {
    label: string;
    value: string | number;
    unit?: string;
  }[];
}

export const AnalyticsCard = ({ title, metrics }: AnalyticsCardProps) => {
  return (
    <Card className="bg-gray-800">
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">{title}</h3>
        <div className="space-y-3 text-gray-100">
          {metrics.map((metric, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm sm:text-base">{metric.label}</span>
              <span className="font-medium">
                {metric.value}
                {metric.unit && <span className="ml-1">{metric.unit}</span>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};