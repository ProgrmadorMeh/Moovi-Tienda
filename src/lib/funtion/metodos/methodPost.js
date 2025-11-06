import { createClient } from '@/lib/supabaseClient';

/**
 * Sube uno o varios registros a Supabase.
 * Si se inserta un celular, inserta o recupera primero la marca y la vincula.
 * Permite subir múltiples imágenes y guardar sus URLs en el campo "imageUrl".
 *
 * @param {Object} datos - Datos del formulario.
 * @param {string} tabla - Nombre de la tabla destino.
 * @returns {Promise<{ success: boolean, message: string, data: any[] | null }>}
 */
export async function methodPost(datos, tabla) {
  const supabase = createClient();

  // Validar campos vacíos (excepto archivos)
  for (const [key, value] of Object.entries(datos)) {
    if (key !== 'files' && (!value || value === '')) {
      return {
        success: false,
        message: `El campo "${key}" es obligatorio`,
        data: null,
      };
    }
  }

  try {
    // --- Manejo de marcas si es un celular ---
    if (tabla === 'celulares' && datos.brand) {
      const { data: marcaExistente, error: marcaError } = await supabase
        .from('marcas')
        .select('id')
        .eq('nombre', datos.brand)
        .single();

      let marcaId;

      if (marcaError && marcaError.code !== 'PGRST116') {
        throw marcaError;
      }

      if (marcaExistente) {
        marcaId = marcaExistente.id;
      } else {
        // Insertar nueva marca
        const { data: nuevaMarca, error: errorMarcaInsert } = await supabase
          .from('marcas')
          .insert({ nombre: datos.brand })
          .select()
          .single();

        if (errorMarcaInsert) {
          throw errorMarcaInsert;
        }

        marcaId = nuevaMarca.id;
      }

      datos.id_brand = marcaId;
      delete datos.brand; // ya no se necesita el nombre
    }

    // --- Subida de múltiples imágenes ---
    const files = datos.files || [];
    delete datos.files; // no queremos enviar los archivos al insert

    if (Array.isArray(files) && files.length > 0) {
      const urls = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `productos/${fileName}`;

        // Subir cada archivo al bucket 'imagenes'
        const { error: uploadError } = await supabase.storage
          .from('imagenes')
          .upload(filePath, file);

        if (uploadError) {
          return {
            success: false,
            message: `Error al subir imagen: ${uploadError.message}`,
            data: null,
          };
        }

        // Obtener URL pública
        const { data: publicUrlData } = supabase.storage
          .from('imagenes')
          .getPublicUrl(filePath);

        urls.push(publicUrlData.publicUrl);
      }

      // Guardar el array en imageUrl (manteniendo el nombre original)
      datos.imageUrl = urls;
    }

    // --- Insertar en la tabla ---
    const { data, error } = await supabase
      .from(tabla)
      .insert(datos)
      .select();

    if (error) {
      return {
        success: false,
        message: `Error al insertar en ${tabla}: ${error.message}`,
        data: null,
      };
    }

    return {
      success: true,
      message: `Registro insertado correctamente en ${tabla}`,
      data,
    };
  } catch (err) {
    return {
      success: false,
      message: `Error inesperado: ${err.message}`,
      data: null,
    };
  }
}
