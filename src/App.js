// ⚠️ CAMBIAR ESTA URL POR LA TUYA DE POSTGREST
const API_BASE_URL = 'https://postgrest-api-production-7372.up.railway.app';

import React, { useState, useEffect } from 'react';

// Iconos simples con emojis - sin dependencias
const Search = ({ className }) => <span className={className}>🔍</span>;
const MessageSquare = ({ className }) => <span className={className}>💬</span>;
const Users = ({ className }) => <span className={className}>👥</span>;
const FileText = ({ className }) => <span className={className}>📄</span>;
const HelpCircle = ({ className }) => <span className={className}>❓</span>;
const Award = ({ className }) => <span className={className}>🏆</span>;
const RefreshCw = ({ className }) => <span className={className}>🔄</span>;
const Calendar = ({ className }) => <span className={className}>📅</span>;
const Mail = ({ className }) => <span className={className}>📧</span>;
const Phone = ({ className }) => <span className={className}>📞</span>;
const MapPin = ({ className }) => <span className={className}>📍</span>;
const User = ({ className }) => <span className={className}>👤</span>;
const MessageCircle = ({ className }) => <span className={className}>💭</span>;
const TrendingUp = ({ className }) => <span className={className}>📈</span>;
const Eye = ({ className }) => <span className={className}>👁️</span>;

const MobileDashboard = () => {
  const [activeTab, setActiveTab] = useState('conversaciones');
  const [data, setData] = useState({
    conversaciones: [],
    contactos: [],
    propuestas: [],
    participantes: [],
    faq: [],
    estadisticas: {}
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar todos los datos - FUNCIÓN ARREGLADA
  const fetchData = async () => {
    setLoading(true);
    try {
      const [conversacionesRes, contactosRes, propuestasRes, participantesRes, faqRes] = await Promise.all([
        fetch(`${API_BASE_URL}/conversaciones_vista?limit=50`),
        fetch(`${API_BASE_URL}/contactos_vista?limit=100`),
        fetch(`${API_BASE_URL}/propuestas_vista?limit=50`),
        fetch(`${API_BASE_URL}/participantes_vista?limit=50`),
        fetch(`${API_BASE_URL}/faq_vista?limit=20`)
      ]);
      
      let conversaciones = [];
      let contactos = [];
      let propuestas = [];
      let participantes = [];
      let faq = [];

      // Procesar cada respuesta con protección contra errores
      if (conversacionesRes.ok) {
        conversaciones = await conversacionesRes.json();
        if (!Array.isArray(conversaciones)) conversaciones = [];
      }
      
      if (contactosRes.ok) {
        contactos = await contactosRes.json();
        if (!Array.isArray(contactos)) contactos = [];
      }
      
      if (propuestasRes.ok) {
        propuestas = await propuestasRes.json();
        if (!Array.isArray(propuestas)) propuestas = [];
      }
      
      if (participantesRes.ok) {
        participantes = await participantesRes.json();
        if (!Array.isArray(participantes)) participantes = [];
      }
      
      if (faqRes.ok) {
        faq = await faqRes.json();
        if (!Array.isArray(faq)) faq = [];
      }

      // Calcular estadísticas básicas
      const estadisticas = {
        total_contactos: contactos.length,
        conversaciones_hoy: conversaciones.filter(c => 
          new Date(c.timestamp).toDateString() === new Date().toDateString()
        ).length,
        propuestas_pendientes: propuestas.filter(p => 
          new Date(p.fecha_creacion) >= new Date(Date.now() - 7*24*60*60*1000)
        ).length,
        participantes_activos: participantes.filter(p => p.estado === 'activo').length
      };
      
      setData({ conversaciones, contactos, propuestas, participantes, faq, estadisticas });
    } catch (error) {
      console.error('Error fetching data:', error);
      // En caso de error, mantener arrays vacíos
      setData({
        conversaciones: [],
        contactos: [],
        propuestas: [],
        participantes: [],
        faq: [],
        estadisticas: {}
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  // Filtrar datos por búsqueda
  const filterData = (items, searchFields) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      searchFields.some(field => 
        item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const StatsCard = ({ icon: Icon, title, value, color = "blue" }) => (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg mr-3 ${
          color === 'blue' ? 'bg-blue-100' : 
          color === 'green' ? 'bg-green-100' :
          color === 'orange' ? 'bg-orange-100' :
          color === 'purple' ? 'bg-purple-100' : 'bg-gray-100'
        }`}>
          <Icon className={`w-4 h-4 ${
            color === 'blue' ? 'text-blue-600' : 
            color === 'green' ? 'text-green-600' :
            color === 'orange' ? 'text-orange-600' :
            color === 'purple' ? 'text-purple-600' : 'text-gray-600'
          }`} />
        </div>
        <div>
          <p className="text-xs text-gray-600">{title}</p>
          <p className="text-lg font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );

  const ConversacionCard = ({ item }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-3">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center text-xs text-gray-500">
          <User className="w-3 h-3 mr-1" />
          <span className="font-medium">{item.contacto_nombre}</span>
        </div>
        <span className="text-xs text-gray-500 flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {formatDate(item.timestamp)}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400">
          <p className="text-sm text-gray-700 font-medium mb-1">Usuario:</p>
          <p className="text-sm text-gray-800">{item.user_message}</p>
        </div>
        
        {item.ai_response && (
          <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-600">
            <p className="text-sm text-blue-700 font-medium mb-1">IA:</p>
            <p className="text-sm text-gray-800">{item.ai_response}</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-500">
          {item.email && (
            <span className="flex items-center mr-3">
              <Mail className="w-3 h-3 mr-1" />
              {item.email}
            </span>
          )}
        </div>
        {item.tipo && (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
            {item.tipo}
          </span>
        )}
      </div>
    </div>
  );

  const ContactoCard = ({ item }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-3">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-800 text-base">{item.nombre_completo}</h4>
        {item.fecha_primer_contacto && (
          <span className="text-xs text-gray-500 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDateOnly(item.fecha_primer_contacto)}
          </span>
        )}
      </div>
      
      <div className="space-y-2 mb-3">
        {item.email && (
          <p className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            {item.email}
          </p>
        )}
        {item.telefono && (
          <p className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            {item.telefono}
          </p>
        )}
        {item.domicilio && (
          <p className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            {item.domicilio}
          </p>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {item.edad && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            {item.edad} años
          </span>
        )}
        {item.genero && (
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
            {item.genero}
          </span>
        )}
        {item.nivel_educacion && (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            {item.nivel_educacion}
          </span>
        )}
      </div>
      
      {item.ultima_interaccion && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <span className="font-medium">Última interacción:</span> {formatDate(item.ultima_interaccion)}
        </div>
      )}
      
      {item.notas && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <span className="font-medium">Notas:</span> {item.notas}
          </p>
        </div>
      )}
    </div>
  );

  const PropuestaCard = ({ item }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-3">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-1" />
          {item.contacto_nombre}
        </div>
        <span className="text-xs text-gray-500 flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {formatDate(item.fecha_creacion)}
        </span>
      </div>
      
      <div className="bg-gray-50 p-3 rounded-lg mb-3 border-l-4 border-orange-400">
        <p className="text-sm text-gray-800 leading-relaxed">{item.propuesta}</p>
      </div>
      
      {item.categoria && (
        <div className="mb-3">
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
            📁 {item.categoria}
          </span>
        </div>
      )}
      
      <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
        <div className="space-y-1">
          {item.email && (
            <p className="flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              {item.email}
            </p>
          )}
          {item.telefono && (
            <p className="flex items-center">
              <Phone className="w-3 h-3 mr-1" />
              {item.telefono}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const ParticipanteCard = ({ item }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-3">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-800">{item.contacto_nombre}</h4>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          item.estado === 'activo' ? 'bg-green-100 text-green-700' :
          item.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
          item.estado === 'inactivo' ? 'bg-gray-100 text-gray-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {item.estado?.toUpperCase()}
        </span>
      </div>
      
      <div className="space-y-2 mb-3">
        <p className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          Registro: {formatDate(item.fecha_registro)}
        </p>
        
        {item.email && (
          <p className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            {item.email}
          </p>
        )}
        
        {item.telefono && (
          <p className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            {item.telefono}
          </p>
        )}
        
        {item.domicilio && (
          <p className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            {item.domicilio}
          </p>
        )}
      </div>
      
      {item.notas && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <span className="font-medium">Notas:</span> {item.notas}
          </p>
        </div>
      )}
    </div>
  );

  const FaqCard = ({ item }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-3">
      <div className="flex justify-between items-start mb-3">
        <span 
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${item.categoria_color}20`,
            color: item.categoria_color
          }}
        >
          {item.categoria_nombre}
        </span>
        <div className="flex items-center text-xs text-gray-500">
          <Eye className="w-3 h-3 mr-1" />
          {item.veces_consultada} vistas
        </div>
      </div>
      
      <h4 className="font-semibold text-gray-800 mb-2 leading-tight">{item.pregunta}</h4>
      
      <div className="bg-gray-50 p-3 rounded-lg mb-3">
        <p className="text-sm text-gray-700 leading-relaxed">{item.respuesta}</p>
      </div>
      
      {item.tags && (
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.split(',').slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
        <span className="flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" />
          Prioridad: {item.prioridad}
        </span>
        <span>Actualizado: {formatDateOnly(item.fecha_actualizacion)}</span>
      </div>
    </div>
  );

  const currentData = {
    conversaciones: filterData(data.conversaciones, ['user_message', 'ai_response', 'contacto_nombre', 'email']),
    contactos: filterData(data.contactos, ['nombre_completo', 'email', 'telefono', 'domicilio']),
    propuestas: filterData(data.propuestas, ['propuesta', 'contacto_nombre', 'categoria']),
    participantes: filterData(data.participantes, ['contacto_nombre', 'estado', 'email']),
    faq: filterData(data.faq, ['pregunta', 'respuesta', 'categoria_nombre', 'tags'])
  };

  const tabs = [
    { key: 'conversaciones', label: 'Conversaciones', icon: MessageSquare, count: data.conversaciones.length },
    { key: 'contactos', label: 'Contactos', icon: Users, count: data.contactos.length },
    { key: 'propuestas', label: 'Propuestas', icon: FileText, count: data.propuestas.length },
    { key: 'participantes', label: 'Fundación', icon: Award, count: data.participantes.length },
    { key: 'faq', label: 'FAQ', icon: HelpCircle, count: data.faq.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">📱 Dashboard Admin</h1>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatsCard icon={Users} title="Contactos" value={data.estadisticas.total_contactos || 0} color="blue" />
          <StatsCard icon={MessageCircle} title="Conv. Hoy" value={data.estadisticas.conversaciones_hoy || 0} color="green" />
          <StatsCard icon={FileText} title="Propuestas" value={data.estadisticas.propuestas_pendientes || 0} color="orange" />
          <StatsCard icon={Award} title="Participantes" value={data.estadisticas.participantes_activos || 0} color="purple" />
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar en todas las secciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b overflow-x-auto sticky top-16 z-30">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 py-3 px-3 text-xs font-medium text-center border-b-2 ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4 inline mr-1" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.slice(0,4)}</span>
              <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-6">
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Cargando datos...</p>
          </div>
        ) : (
          <>
            {activeTab === 'conversaciones' && currentData.conversaciones.map(item => (
              <ConversacionCard key={item.id} item={item} />
            ))}
            {activeTab === 'contactos' && currentData.contactos.map(item => (
              <ContactoCard key={item.id} item={item} />
            ))}
            {activeTab === 'propuestas' && currentData.propuestas.map(item => (
              <PropuestaCard key={item.id} item={item} />
            ))}
            {activeTab === 'participantes' && currentData.participantes.map(item => (
              <ParticipanteCard key={item.id} item={item} />
            ))}
            {activeTab === 'faq' && currentData.faq.map(item => (
              <FaqCard key={item.id} item={item} />
            ))}
            
            {currentData[activeTab]?.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No hay datos disponibles</p>
                <p className="text-gray-400 text-sm">
                  {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Los datos aparecerán aquí cuando estén disponibles'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MobileDashboard;
