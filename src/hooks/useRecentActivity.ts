
"use client";

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { RecentActivityItem } from '@/lib/types';
import { BookOpenCheck, Lightbulb, CheckSquare } from 'lucide-react';

const MAX_ACTIVITIES = 5;

export function useRecentActivity() {
  const [activities, setActivities] = useLocalStorage<RecentActivityItem[]>('quizzicalai_recentActivities', []);

  const addActivity = useCallback((
    type: 'quiz' | 'study' | 'solve',
    description: string
  ) => {
    let icon;
    switch (type) {
        case 'quiz': icon = BookOpenCheck; break;
        case 'study': icon = Lightbulb; break;
        case 'solve': icon = CheckSquare; break;
        default: icon = undefined;
    }

    const newActivity: RecentActivityItem = {
      id: crypto.randomUUID(),
      type,
      description,
      timestamp: Date.now(),
      icon, // Store the component itself, not its name
    };

    setActivities(prevActivities => {
      const updatedActivities = [newActivity, ...prevActivities];
      return updatedActivities.slice(0, MAX_ACTIVITIES);
    });
  }, [setActivities]);

  return { activities, addActivity };
}
