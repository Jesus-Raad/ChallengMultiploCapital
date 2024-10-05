1. Arquitectura Principal
Este proyecto está diseñado con Next.js, utilizando React para la interacción del frontend y varias bibliotecas para la visualización de datos y manejo de tablas. La aplicación incluye un menú de navegación que permite  moverse entre diferentes páginas: Información, Análisis y Política de Privacidad. Cada página tiene una funcionalidad específica:

Página de Información: Muestra una tabla editable de activos financieros usando ReactGrid, con funcionalidad de autocompletado.

Página de Análisis: Muestra el valor total del portafolio y un gráfico circular que distribuye el valor por tipo de activo, utilizando Chart.js.

Página de Política de Privacidad: Contiene un texto estático sobre las políticas de privacidad.

2. Módulos Utilizados
Next.js: Marco principal del proyecto.

ReactGrid: Usado para mostrar y editar la tabla en la página de Información. Permite a los usuarios ingresar y modificar datos, con funcionalidad de autocompletado.

Chart.js: Librería para la visualización gráfica de datos. Se utilizó en la página de Análisis para crear el gráfico circular que representa la distribución del portafolio.

PapaParse: Librería para parsear archivos CSV. Esto se utilizó para leer los datos estáticos (acciones, criptomonedas, ETF) desde un archivo CSV local en la página de Información.

localStorage: Se utiliza para la persistencia de datos. Los datos que los usuarios ingresan en la tabla (acciones, precios, etc.) se guardan localmente para que no se pierdan al navegar entre páginas.

Context API de React: Se utilizó para compartir los datos del portafolio entre las páginas de Información y Análisis.


3. Decisiones Técnicas

Manejo de estado con Context API: Opté por usar la API de Contexto de React para manejar los datos compartidos entre las diferentes páginas, como la lista de activos. 

Persistencia de datos con localStorage: Decidí almacenar los datos en localStorage para que los usuarios puedan navegar entre las diferentes páginas sin perder los valores ingresados. 

Gráfico con Chart.js: Se utilizó Chart.js . Se eligió un gráfico circular para visualizar la distribución de los activos por clase (acciones, criptomonedas, ETF).

4. Explicación de las Páginas

AnalysisSection.jsx:

Calcula el valor total del portafolio en función del número de acciones y el precio ingresado por el usuario.
Visualiza estos datos en una tabla y un gráfico circular que muestra la distribución por tipo de activo.


InfoSection.jsx:

Usa ReactGrid para mostrar una tabla con los activos y permite editar las columnas de Acciones y Precio.
Implementa una función de autocompletado en la columna "Nombre", que rellena automáticamente las columnas ISIN, TIKR y Volatilidad basándose en la selección del usuario.
Los datos se cargan desde un archivo CSV y se guardan en localStorage para persistencia.


PrivacyPolitics.jsx:

Simplemente muestra un texto estático relacionado con las políticas de privacidad.