"use client";

export default function Dash01() {
    return (
        <div className="flex flex-col w-full h-screen p-4">
            <div className="flex flex-row w-full mb-4">
                <div className="w-2/3 h-full bg-blue-500 mr-4">
                    {/* Gráfico principal (maior) */}
                </div>
                <div className="flex flex-col w-1/3 space-y-4">
                    <div className="h-48 bg-red-500">
                        {/* Gráfico 1 (coluna) */}
                    </div>
                    <div className="h-48 bg-red-500">
                        {/* Gráfico 2 (coluna) */}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="h-40 bg-red-500">
                    {/* Gráfico 3 */}
                </div>
                <div className="h-40 bg-red-500">
                    {/* Gráfico 4 */}
                </div>
                <div className="h-40 bg-red-500">
                    {/* Gráfico 5 */}
                </div>
            </div>
        </div>
    );
}
