const checkitem_labels = {
    'form_selected': 'Выбрана правильная лид-форма',
    'form_work': 'Ли-форма корректно срабатывает',
    'content_type_image': 'Изображения объявлений проставлены корректно',
    'content_type_video': 'Видео объявлений проставлены корректно',
    'default_reply': 'Установлено корректное приветственное сообщение',
    'custom_reply': ' Установлено корректное приветственное сообщение',
    'chat_reply': ' Установлен верный чат',
    'content_type_catalog': 'Подключен верный каталог',
    'auditory_expansion_disabled': 'Автоматическое расширение аудитории выключено',
    'auditory_expansion_enabled': 'Автоматическое расширение аудитории включено',
    'split_test_disabled': 'Сплит-тест выключен',
    'split_test_enabled': 'Сплит-тест включен',
    'dynamic_creatives_disabled': 'Динамические креативы не используются',
    'dynamic_creatives_enabled': 'Динамические креативы включены',
    'device_exclude_enabled': 'Указано исключение по устройствам',
    'device_exclude_disabled': 'Исключение по устройствам выключено',
    'budget_type_dayly': 'Установлен дневной бюджет',
    'budget_type_all': 'Установлен бюджет на весь срок',
    'date_end_disabled': 'Дата окончания кампании не установлена',
    'date_end_enabled': 'Установлена корректная дата завершения показа',
    'os_limit_disabled': 'Установлен лимит по версии OS',
    'os_limit_enabled': 'Не установлен лимит по версии OS',
    'use_link_enabled': 'Указана корректная ссылка',
    'use_short_link_enabled': 'Указана корректная короткая ссылка',
}

const params_labels = {
    'message_type': 'Тип сообщения',
    'use_short_link': 'Используется короткая ссылка'
}

const params = {
    'goal_lead_form': {
        'check_item': [
            'form_selected',
            'form_work'
        ]
    },
    'goal_message': {
        'params': {
            'message_type': {
                type: 'select',
                options: {
                    'default_reply': 'Стандартное приветственное сообщение',
                    'custom_reply': 'Пользовательское приветственное сообщение',
                    'chat_reply': 'Автоматический чат',
                },
                block: '#adParams'
            }
        }
    },
    'use_link_enabled': {
        'params': {
            'use_short_link': {
                type: 'select',
                options: {
                    'use_short_link_disabled': 'Не используется',
                    'use_short_link_enabled': 'Используется',
                },
                block: '#adParams'
            }
        }
    }
}

function addParam(name, data)
{
    let template = '';
    if (data.type == 'select') {
        if (typeof $('#'+name).val() === 'undefined') {
            template = '<div class="form-group col-md-4 offset-md-4 dynamic-param"><label for="' + name + '">' + params_labels[name] + '</label><select id="' + name + '" class="form-control">';

            Object.entries(data.options).forEach(([key, value]) => {
                template += '<option value="' + key + '">' + value + '</option>';
            })

            template += '</select></div>';
        }
    }

    $(data.block).append(template);
}

function rebuildParams(element) {
    let changed_param = $(element).val();

    if (typeof params[changed_param] !== 'undefined'
        && typeof params[changed_param].params !== 'undefined') {

        Object.entries(params[changed_param].params).forEach(([key, value]) => {
            // addParam(key, value.type, value.options);
            addParam(key, value);
        })
    }
}

function addCheckItem(name) {
    let template = '<div class="form-group gererated-item"><input type="checkbox" class="form-check-input" id="' + name + '"><label class="form-check-label" for="' + name + '">' + checkitem_labels[name] + '</label></div>';
    
    $('#checklist').append(template)
}

function rebuildChecklist() {
    let goals = [];

    var fields = document.getElementById("paramsForm").elements;
    Object.entries(fields).forEach(([key, element]) => {
        if ($(element).localName != 'button'
            && $(element).val() != '')

            goals.push($(element).val());
    })

    goals.forEach((goal) => {
        if (typeof params[goal] !== 'undefined') {
            if (typeof params[goal]['check_item'] !== 'undefined') {
                params[goal]['check_item'].forEach((check) => {
                    addCheckItem(check);
                })
            }
        } else if (typeof checkitem_labels[goal] !== 'undefined') {
            addCheckItem(goal);
        }
    })
}

function refreshChecklist() {
    $('.gererated-item').remove();
}

function clearPreviousParams(previous)
{
    if (typeof params[previous] !== 'undefined'
        && typeof params[previous]['params'] !== 'undefined') {
        
        Object.entries(params[previous]['params']).forEach((param) => {
            console.log(param[0]);
            console.log($('#'+param[0]).parent().remove());
        })
    }
}

$(document).ready(() => {
    let previous;
    $('body').on('click', '#paramsForm select', (e) => {
        previous = e.target.value;
    })

    $('#paramsForm').change((e) => {
        clearPreviousParams(previous);
        var fields = document.getElementById("paramsForm").elements;
        Object.entries(fields).forEach(([key, element]) => {
            if ($(element).localName != 'button')
                rebuildParams(element);
        })
    })

    $('#checklistGenerate').click((e) => {
        e.preventDefault();
        
        refreshChecklist();
        rebuildChecklist();
        $('#checklist').show();
    })

    $('#copyChecklist').click((e) =>{
        let temp_copy = $("<textarea>");
        let temp_text = $('#checklist .form-group').text();

        temp_text = temp_text.replace(/[ \t\n]*([А-Я])/g, "\r\n$1").trim();
        $("body").append(temp_copy);
        temp_copy.val(temp_text).select();

        document.execCommand("copy");
        temp_copy.remove();
    })
})
