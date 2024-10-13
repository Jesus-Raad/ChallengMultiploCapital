1. Arquitectura Principal

El proyecto está construido con Next.js y React para el frontend. Se usan varias bibliotecas para manejar la visualización de datos y tablas. Hay un menú de navegación que permite moverse entre tres páginas principales: Tabla de Activos, Análisis y Política de Privacidad. Cada una tiene su propia función:

Página de la tabla de activos: Aquí se muestra una tabla editable de activos financieros usando ReactGrid, con autocompletado.

Página de Análisis: Muestra el valor total del portafolio y un gráfico circular que distribuye el valor por tipo de activo (acciones, criptomonedas, etc.) usando Chart.js.

Página de Política de Privacidad: Contiene solo un texto fijo explicando las políticas de privacidad.

2. Explicación de las Páginas

TablaClientProducts.jsx: Utiliza ReactGrid para mostrar una tabla con solo encabezados. Hay un botón que abre un modal donde se pueden filtrar opciones y seleccionar una. Al hacer clic en "Agregar", se añaden los datos (nombre, ISIN, TIKR, volatilidad) a la tabla. Los campos de acciones y precios quedan vacíos para que el usuario los complete.

AnalysisSection.jsx: Toma los datos ingresados en la página de la Tabla de Activos, usando localStorage, y los muestra en una tabla con el valor total de cada activo. También muestra un gráfico circular que representa la proporción de los activos por tipo.

PrivacyPolitics.jsx: Simplemente muestra un texto fijo sobre las políticas de privacidad.

3. Módulos Utilizados

Next.js: Es el marco principal del proyecto.

ReactGrid: Se usa para la tabla editable en la página de Información. Los usuarios pueden ingresar y modificar datos, con autocompletado.

Chart.js: Esta librería sirve para crear gráficos. Se usó en la página de Análisis para hacer el gráfico circular que muestra la distribución del portafolio.

PapaParse: Sirve para leer archivos CSV. Lo usé para cargar datos estáticos de acciones y otros activos en la página de Información.

4. Decisiones Técnicas

Manejo de estado con Context API: Decidí usar Context API para pasar datos entre las páginas, como las opciones de autocompletado.

Persistencia de datos con localStorage: Almaceno los datos en localStorage para que no se pierdan al moverse entre páginas.
