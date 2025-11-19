import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, Eye, Inbox, CheckCheck } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

interface Notification {
    id: number;
    title: string;
    message: string;
    read: boolean;
    link: string;
    createdAt: string;
}

type FilterType = 'all' | 'unread' | 'read';

const NotificacoesPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('all'); // Estado do filtro

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/notifications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (id: number) => {
        // Atualiza visualmente primeiro (Otimistic UI)
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

        const token = localStorage.getItem('token');
        await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    };

    const markAllAsRead = async () => {
        // Filtra apenas as não lidas para evitar requisições desnecessárias
        const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
        
        if (unreadIds.length === 0) return;

        // Atualiza visualmente
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));

        const token = localStorage.getItem('token');
        // Loop simples para marcar todas (idealmente o backend teria uma rota de "mark all")
        for (const id of unreadIds) {
             await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        }
    };

    // Lógica de Filtragem
    const filteredNotifications = useMemo(() => {
        return notifications.filter(n => {
            if (filter === 'unread') return !n.read;
            if (filter === 'read') return n.read;
            return true; // 'all'
        });
    }, [notifications, filter]);

    if (isLoading) return <div className="p-8 text-center">Carregando avisos...</div>;

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-6">
            
            {/* Cabeçalho e Ações */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Bell className="text-orange-500" size={28} />
                    <h2 className="text-2xl font-bold text-gray-800">Notificações</h2>
                </div>
                
                {/* Botão Marcar Todas */}
                {notifications.some(n => !n.read) && (
                    <button 
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                    >
                        <CheckCheck size={16} />
                        Marcar todas como lidas
                    </button>
                )}
            </div>

            {/* Abas de Filtro */}
            <div className="flex border-b border-gray-200">
                <button 
                    onClick={() => setFilter('all')}
                    className={`pb-2 px-4 font-medium text-sm transition-colors border-b-2 ${filter === 'all' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Todas
                </button>
                <button 
                    onClick={() => setFilter('unread')}
                    className={`pb-2 px-4 font-medium text-sm transition-colors border-b-2 ${filter === 'unread' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Não lidas
                    {/* Badge do contador nas abas */}
                    {notifications.filter(n => !n.read).length > 0 && (
                        <span className="ml-2 bg-orange-100 text-orange-600 text-xs px-1.5 py-0.5 rounded-full">
                            {notifications.filter(n => !n.read).length}
                        </span>
                    )}
                </button>
                <button 
                    onClick={() => setFilter('read')}
                    className={`pb-2 px-4 font-medium text-sm transition-colors border-b-2 ${filter === 'read' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Lidas
                </button>
            </div>

            {/* Lista */}
            <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-200">
                        <Inbox className="mx-auto text-gray-300 mb-3" size={48} />
                        <p className="text-gray-500 font-medium">Nenhuma notificação encontrada nesta aba.</p>
                    </div>
                ) : (
                    filteredNotifications.map(notif => (
                        <div 
                            key={notif.id} 
                            className={`p-4 rounded-xl border transition-all animate-fade-in ${
                                notif.read 
                                    ? 'bg-white border-gray-100 opacity-75 hover:opacity-100' 
                                    : 'bg-orange-50 border-orange-200 shadow-sm'
                            }`}
                        >
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex-grow">
                                    <h4 className={`font-bold text-base flex items-center gap-2 ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                        {!notif.read && <span className="w-2 h-2 bg-orange-500 rounded-full shrink-0"></span>}
                                        {notif.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(notif.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-2 shrink-0">
                                    <Link 
                                        to={notif.link} 
                                        onClick={() => markAsRead(notif.id)}
                                        className="p-2 bg-white border border-gray-200 text-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
                                        title="Ver Detalhes"
                                    >
                                        <Eye size={18} />
                                    </Link>

                                    {!notif.read && (
                                        <button 
                                            onClick={() => markAsRead(notif.id)}
                                            className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-green-600 hover:bg-green-50 hover:border-green-200 rounded-lg transition-colors"
                                            title="Marcar como lida"
                                        >
                                            <Check size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificacoesPage;