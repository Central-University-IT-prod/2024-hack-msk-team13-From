import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Plane, Calendar, Search, Globe, Clock, Wallet, ArrowRight, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TripCard from '../components/TripCard';
import { InitDataLogger } from '@/components/InitData';
import axios from 'axios';
const userStats = {
  countriesVisited: 12,
  monthlyExpenses: 1250,
  upcomingRides: 3,
  yearlyTravelHours: 156
};

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Функция для получения данных с сервера
    const fetchTrips = async () => {
      try {
        const userInfo = {
          init_data: '1',
        };

        const response = await axios.get('https://prod.bijouterieshop.ru/api/trips', {
          params: userInfo
        });

        // Устанавливаем данные поездок в состояние
        setTrips(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке поездок:", error);
      }
    };

    fetchTrips();
  }, []); // Загружаем данные только один раз при монтировании компонента

  const filteredTrips = React.useMemo(() => {
    if (!searchQuery.trim()) return trips;

    const query = searchQuery.toLowerCase().trim();
    return trips.filter((trip) => {
      const searchableFields = [
        trip.origin.toLowerCase(),
        trip.destination.toLowerCase(),
        trip.ticketNumber.toLowerCase(),
        format(new Date(trip.departureDate), 'MMM d, yyyy', { locale: ru }).toLowerCase()
      ];

      return searchableFields.some(field => field.includes(query));
    });
  }, [searchQuery, trips]);

  return (
    <div className="pb-20">
      <InitDataLogger />
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1c2a3a] rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="shrink-0 text-[#5ebbf6]" size={20} />
            <span className="text-gray-400">Страны</span>
          </div>
          <p className="text-2xl font-bold">{userStats.countriesVisited}</p>
          <p className="text-xs text-gray-400">посещено в этом году</p>
        </div>
        
        <div className="bg-[#1c2a3a] rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Wallet className="shrink-0 text-[#5ebbf6]" size={20} />
            <span className="text-gray-400">Расходы</span>
          </div>
          <p className="text-2xl font-bold">${userStats.monthlyExpenses}</p>
          <p className="text-xs text-gray-400">в этом месяце</p>
        </div>

        <div className="bg-[#1c2a3a] rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowRight className="shrink-0 text-[#5ebbf6]" size={20} />
            <span className="text-gray-400">Предстоящие</span>
          </div>
          <p className="text-2xl font-bold">{userStats.upcomingRides}</p>
          <p className="text-xs text-gray-400">запланированные поездки</p>
        </div>

        <div className="bg-[#1c2a3a] rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="shrink-0 text-[#5ebbf6]" size={20} />
            <span className="text-gray-400">Длительность</span>
          </div>
          <p className="text-2xl font-bold">{userStats.yearlyTravelHours}ч</p>
          <p className="text-xs text-gray-400">в пути за год</p>
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Поиск по направлению, номеру билета или дате..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1c2a3a] rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5ebbf6]"
          />
        </div>
        <button
          onClick={() => navigate('/ai-chat')}
          className="flex items-center justify-center bg-[#5ebbf6] hover:bg-[#4da8e4] text-white px-4 rounded-lg transition-colors"
          title="Чат с ИИ-ассистентом"
        >
          <Bot size={24} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-300">Ваши поездки</h2>
          <span className="text-sm text-gray-400">
            {filteredTrips.length} {filteredTrips.length === 1 ? 'поездка' : 
              filteredTrips.length >= 2 && filteredTrips.length <= 4 ? 'поездки' : 'поездок'}
          </span>
        </div>
        
        <div className="space-y-8">
          {filteredTrips.length > 0 ? (
            filteredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>Поездки не найдены.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
