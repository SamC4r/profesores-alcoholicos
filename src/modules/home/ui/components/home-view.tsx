interface Props {
    name: string;
}

export const HomeView = ({ name }: Props) => {
    return (
        <div className="min-h-screen bg-gradient-to-br">
            {/* Header */}
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
                       Hola {name} 
                    </h1>
                    
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <span className="text-2xl">⭐</span>
                        </div>
                        <h3 className="font-semibold text-green-900 mb-2">Rate a Beer</h3>
                        <p className="text-green-700 text-sm">Share your thoughts on a recent brew</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <span className="text-2xl">🔍</span>
                        </div>
                        <h3 className="font-semibold text-green-900 mb-2">Discover</h3>
                        <p className="text-green-700 text-sm">Find new beers to try</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <span className="text-2xl">📊</span>
                        </div>
                        <h3 className="font-semibold text-green-900 mb-2">My Stats</h3>
                        <p className="text-green-700 text-sm">View your rating history</p>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-green-900 mb-4 text-center">
                        Your Beer Journey
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-green-50 rounded-lg p-4">
                            <p className="text-3xl font-bold text-green-600">12</p>
                            <p className="text-green-700">Beers Rated</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                            <p className="text-3xl font-bold text-green-600">4.2</p>
                            <p className="text-green-700">Avg Rating</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};