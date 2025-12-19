import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  let color = "hsl(var(--destructive))"; // Red for low
  if (score >= 50) color = "hsl(var(--primary))"; // Blue for medium
  if (score >= 80) color = "hsl(142 76% 36%)"; // Green for high

  const emptyColor = "hsl(var(--muted))";

  return (
    <div className="relative h-48 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={180}
            endAngle={0}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell key="score" fill={color} cornerRadius={10} />
            <Cell key="remaining" fill={emptyColor} />
            <Label
              value={score}
              position="center"
              className="fill-foreground font-display text-5xl font-bold"
              dy={-10}
            />
            <Label
              value="ATS Score"
              position="center"
              className="fill-muted-foreground font-body text-xs font-medium uppercase tracking-wider"
              dy={20}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Decorative pulse for high scores */}
      {score >= 80 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-green-500/10 z-[-1]"
        />
      )}
    </div>
  );
}
