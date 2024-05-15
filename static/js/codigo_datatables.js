function checkForValidations(evt) {
  var $obj = $(this);
  if ($obj.hasClass('required')){
      if (emptyField($obj)){
          shake($obj);
      } else {
          $obj.removeClass("error animated shake").addClass('success');
      }
  }
  if ($obj.hasClass('email')){
      if (!emptyField($obj)){
          validaEmail($obj);
      }
  }
  if ($obj.hasClass('confirmation')){
      if (!emptyField($obj)){
          matchFields($obj);
      }
  }
}
function removeValidationClass(evt) {
  $(this).removeClass('success error animated shake');
}

$(document).ready(function() {
	 
  //-- Código para traducir datatable a español --//     
    var table = $('.tabla').DataTable({		
						"bDestroy": true,
						lengthChange: false,
						"deferRender": true,
		 				"bProcessing": true,
    					"bDeferRender": true,
						//configuro lenguaje en español
                        "language": {
                            "sProcessing":    "Procesando...",
                            "sLengthMenu":    "Mostrar _MENU_ registros",
                            "sZeroRecords":   "No se encontraron resultados",
                            "sEmptyTable":    "Ningún dato disponible en esta tabla",
                            "sInfo":          "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                            "sInfoEmpty":     "Mostrando registros del 0 al 0 de un total de 0 registros",
                            "sInfoFiltered":  "(filtrado de un total de _MAX_ registros)",
                            "sInfoPostFix":   "",
                            "sSearch":        "Buscar:",
                            "sUrl":           "",
                            "sInfoThousands":  ",",
                            "sLoadingRecords": "Cargando...",
                            "oPaginate": {
                                "sFirst":    "Primero",
                                "sLast":    "Último",
                                "sNext":    "Siguiente",
                                "sPrevious": "Anterior"
                            },
                            "oAria": {
                                "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                            }
                        },
                        dom: 'Bfrtip',
                        buttons: [

                            {
								extend:    'excelHtml5',
								text:      '<i class="fa fa-file-excel-o fa-lg"></i> ',
								titleAttr: 'Exportar a Excel',
                                exportOptions: {
                                    columns: [ 0, 1, 2, 3 ]
                                }
							}
                        ]

                    });

    $("#myModal").on('hide.bs.modal', function(){

        $('#txtNombre').val('');
        $('#txtPrecio').val('');
        $('#txtStock').val('');
        $('#categoria').val('');
        $('#categoria1').val('');
    });

    $('#myModal').on('shown.bs.modal', function () {

        $('#txtNombre').focus();

        $('#txtNombre').removeClass('success error animated shake');
        $('#txtPrecio').removeClass('success error animated shake');
        $('#txtStock').removeClass('success error animated shake');
        $('#categoria').removeClass('success error animated shake');

    });

    $("#myModal").modal("hide");

    $('#myModal').on('blur', 'input', checkForValidations);
    $('#myModal').on('focus', 'input', removeValidationClass);

    $("input[name=categoria]").change(function() {

        var value=$("input[name=categoria]").val();
        var data=$('#listcategoria [value="' + value + '"]').data('value');
        $('#categoria1').val(data);
    });

});