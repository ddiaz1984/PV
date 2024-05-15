$(function() {
	
    // Asignar evento y la función para la limpieza de los campos
    $('#busca').on('input', limpiacampos);
    
    
    $( "#busca" ).autocomplete({
	    minLength: 1, // Inicia autocomplete a partir del 1er caracter tipeado
	    source: function( request, response ) {
	        $.ajax({
                url: "autocomplete_prod.php",
	            dataType: "json",
                type: "GET",
	            data: {
	            	accion: 'autocomplete',
	                parametro: $('#busca').val()
					
					
	            },
				
	            success: function(data) {
	               response(data);

	            },
				beforeSend: function(jqXHR, settings) {
					jqXHR.url = settings.url;
				},
				error: function(jqXHR, exception) {
					alert(jqXHR.url);
				}
	        });
	    },
	    focus: function( event, ui ) {
	        $("#busca").val( ui.item.nombre);
			
			
	        cargarDatos();
	        return false;
	    },
	    select: function( event, ui ) {
	        $("#busca").val( ui.item.nombre);
	        return false;
	    }
    })
    
    // Este es el texto que se muestra al ir escribiendo en el input
/*
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
      return $( "<li>" )
        .append( "<a><b>Codigo: </b>" + item.codigo + "<br><b>Nombre del Producto: </b>" + item.nombre + "</a><br>" )
        .appendTo( ul );
    };
*/

	.autocomplete( "instance" )._renderItem = function( ul, item ) {
      return $( "<li>" )
        .append( "<a style='color: black'><b>" + item.nombre + "</b></a><br>" )
        .appendTo( ul );
    };

	
    // Función para cargar los datos de la consulta en los respectivos campos del formulario HTML
    function cargarDatos(){
    	var busca = $('#busca').val();

    	if(busca != "" && busca.length >= 1){
    		$.ajax({
                url: "autocomplete_prod.php",
	            dataType: "json",	
                type: "GET",
	            data: {
	            	accion: 'consulta',
	                parametro: $('#busca').val()
	            },
	            success: function( data ) {
   
	               $('#codigo').val(data[0]['codigo']);
	               $('#nombre').val(data[0]['nombre']);
	               $('#precioVenta').val(data[0]['precioventa']);
	               $('#stock').val(data[0]['stock']);
					
					
					$('#precioVenta').prop('disabled', false);
                    $('#cantidad').prop('disabled', false);
                    $('#iva').prop('disabled', false);
	            }
	        });
    	}
    }

    // Función para borrar los campos si la búsqueda está vacía
    function limpiacampos(){
       var busca = $('#busca').val();
       if(busca == ""){
	       $('#codigo').val('');
           $('#nombre').val('')
           $('#precioVenta').val('');
           $('#stock').val('')
       }
    }

    
});